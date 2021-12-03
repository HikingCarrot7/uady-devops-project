import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Log, logger, WarningFormatter } from '../logger';
import { RequestWithUserId } from '../routes/types';
import { UserNotFoundException } from '../services/user/user.exceptions';
import { UserService } from '../services/user/user.service';
import { serializeError } from '../utils/serialize_error';

const logWarning = ({
  httpMethod,
  route,
  statusCode = 401,
  errors,
}: Partial<Log>) => {
  logger.log({
    level: 'warn',
    message: `Warning in method: authenticateJWT`,
    httpMethod,
    route,
    statusCode,
    errors,
    formatter: WarningFormatter,
  });
};

export const JWTAuthenticator = (userService: UserService) => {
  class JWTAuthenticatorClass {
    async authenticateJWT(
      req: RequestWithUserId,
      res: Response,
      next: () => void
    ) {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (!token) {
          const errors = serializeError(
            'Se requiere un token válido para el acceso'
          );

          logWarning({
            httpMethod: req.method,
            route: req.originalUrl,
            statusCode: 403,
            errors,
          });

          return res.status(403).json(errors);
        }

        try {
          const decoded: any = jwt.verify(token, process.env.TOKEN_KEY!);
          const user = await userService.getUserById(decoded.id);

          req.userId = user.id;
        } catch (error) {
          if (error instanceof UserNotFoundException) {
            const errors = serializeError(error.message);

            logWarning({
              httpMethod: req.method,
              route: req.originalUrl,
              statusCode: 404,
              errors,
            });

            return res.status(404).json(errors);
          }

          const errors = serializeError('El token es inválido');

          logWarning({
            httpMethod: req.method,
            route: req.originalUrl,
            errors,
          });

          return res.status(401).json(errors);
        }

        return next();
      } else {
        const errors = serializeError('No tienes permisos para acceder');

        logWarning({
          httpMethod: req.method,
          route: req.originalUrl,
          errors,
        });

        res.status(401).json(errors);
      }
    }
  }

  return new JWTAuthenticatorClass();
};
