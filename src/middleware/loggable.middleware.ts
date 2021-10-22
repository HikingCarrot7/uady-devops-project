import { Request, Response } from 'express';
import {
  ErrorFormatter,
  logger,
  RequestMethodDebugFormatter,
  RequestMethodInfoFormatter,
  RequestMethodParamsDebugFormatter,
  WarningFormatter,
} from '../logger';
import { FnCallsCounter } from '../utils/function_calls_counter';
import { isObjectEmpty } from '../utils/is_object_empty';

const jsonMethodCounter = new FnCallsCounter();

export const Loggable = (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  // No loggear nada si estamos testeando...
  if ((global as any).__TESTING__) {
    return descriptor;
  }

  const originalMethod = descriptor.value;

  descriptor.value = function (req: Request, res: Response, next: () => void) {
    const baseLogInfo = {
      httpMethod: req.method,
      route: req.originalUrl,
    };

    const { authorization, ...headers } = req.headers;

    // INFO - Request con query params y headers.
    logger.log({
      level: 'info',
      message: `Request to method: ${propertyKey}`,
      queryParams: req.query,
      headers: headers,
      formatter: RequestMethodInfoFormatter,
      ...baseLogInfo,
    });

    // DEBUG - Request con parámetros y nombre de método.
    if (!isObjectEmpty(req.params)) {
      logger.log({
        level: 'debug',
        message: `Request to method: ${propertyKey}`,
        reqParams: req.params,
        methodName: propertyKey,
        formatter: RequestMethodParamsDebugFormatter,
        ...baseLogInfo,
      });
    }

    // DEBUG - Request con body.
    if (!isObjectEmpty(req.body)) {
      const { password, ...restBody } = req.body;

      logger.log({
        level: 'debug',
        message: `Request to method: ${propertyKey}`,
        reqBody: restBody,
        formatter: RequestMethodDebugFormatter,
        ...baseLogInfo,
      });
    }

    const originalJsonMethod = res.json;

    const loggableJsonMethod = (count: number, message: string) => {
      const toOriginalMethod = () => {
        res.json = originalJsonMethod;
        return res.json(message);
      };

      /* Workaround cutre para evitar que se loggee 2 veces 
      los warnings y errores que ocurren en un end point. 
      Este problema es debido a que el método para validar el JWT 
      también "implementa" o "sobreescribe" este método (res.json) 
      por lo que cuando se llama a un endpoint privado, se llama a este método 
      (porque tienen el decorator @Loggable) y posteriormente se vuelve a 
      llamar este método por el autheticateJWT (porque también tiene el 
      decorador @Loggable)*/
      if (count > 1) {
        return toOriginalMethod();
      }

      if (res.statusCode >= 400 && res.statusCode < 500) {
        // Warnings - ocurrieron errores "esperados".
        logger.log({
          level: 'warn',
          message: `Warning in method: ${propertyKey}`,
          statusCode: res.statusCode,
          error: message,
          formatter: WarningFormatter,
          ...baseLogInfo,
        });
      }

      if (res.statusCode >= 500) {
        // ERROR - Errores "inesperados".
        logger.log({
          level: 'error',
          message: `Something unexpected happened in ${propertyKey}`,
          statusCode: res.statusCode,
          error: message,
          formatter: ErrorFormatter,
          ...baseLogInfo,
        });
      }

      return toOriginalMethod();
    };

    res.json = jsonMethodCounter.provideCounterFor(loggableJsonMethod);

    return originalMethod.call(this, req, res, next);
  };

  return descriptor;
};
