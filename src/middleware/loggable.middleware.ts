import { Request, Response } from 'express';
import {
  ErrorFormatter,
  logger,
  RequestMethodDebugFormatter,
  RequestMethodInfoFormatter,
  WarningFormatter,
} from '../logger';

export const Loggable = () => {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if ((global as any).__TESTING__) {
      return descriptor;
    }

    const originalMethod = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: () => void
    ) {
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

      const { password, ...restBody } = req.body;

      // DEBUG - Request con parámetros y body.
      logger.log({
        level: 'debug',
        message: `Request to method: ${propertyKey}`,
        reqParams: req.params,
        reqBody: restBody,
        formatter: RequestMethodDebugFormatter,
        ...baseLogInfo,
      });

      const originalJsonMethod = res.json;

      const loggableJsonMethond = (message: string) => {
        res.json = originalJsonMethod;

        if (res.statusCode >= 400 && res.statusCode < 500) {
          // Warnings - ocurrieron errores "esperados".
          logger.log({
            level: 'warn',
            message: `Warning in method: ${propertyKey}`,
            statusCode: res.statusCode,
            errors: message,
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

        return res.json(message);
      };

      res.json = loggableJsonMethond;

      return originalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
};
