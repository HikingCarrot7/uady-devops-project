import { Request, Response } from 'express';
import {
  ErrorFormatter,
  logger,
  RequestMethodDebugFormatter,
  RequestMethodInfoFormatter,
  RequestMethodParamsDebugFormatter,
} from '../logger';
import { isEmpty } from '../utils/is_object_empty';

export const Loggable = (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  // No loggear nada si estamos testiando...
  if ((global as any).__TESTING__) {
    return descriptor;
  }

  const originalMethod = descriptor.value;

  descriptor.value = function (req: Request, res: Response) {
    const genericInfo = {
      httpMethod: req.method,
      route: req.originalUrl,
    };

    // INFO - Request con query params y headers.
    logger.log({
      level: 'info',
      message: `Request to method: ${propertyKey}`,
      queryParams: req.query,
      headers: req.headers,
      formatter: RequestMethodInfoFormatter,
      ...genericInfo,
    });

    // DEBUG - Request con parámetros y nombre de método.
    if (!isEmpty(req.params)) {
      logger.log({
        level: 'debug',
        message: `Request to method: ${propertyKey}`,
        reqParams: req.params,
        methodName: propertyKey,
        formatter: RequestMethodParamsDebugFormatter,
        ...genericInfo,
      });
    }

    // DEBUG - Request con body.
    if (!isEmpty(req.body)) {
      const { password, ...restBody } = req.body;

      logger.log({
        level: 'debug',
        message: `Request to method: ${propertyKey}`,
        reqBody: restBody,
        formatter: RequestMethodDebugFormatter,
        ...genericInfo,
      });
    }

    const originalJsonMethod = res.json;

    res.json = (message) => {
      if (res.statusCode >= 400) {
        // ERROR - Errores
        logger.log({
          level: 'error',
          message: `Error in method ${propertyKey}`,
          statusCode: res.statusCode,
          error: JSON.stringify(message),
          formatter: ErrorFormatter,
          ...genericInfo,
        });
      }

      res.json = originalJsonMethod;

      return res.json(message);
    };

    const result = originalMethod.call(this, req, res);

    return result;
  };

  return descriptor;
};
