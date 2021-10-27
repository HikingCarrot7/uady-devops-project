import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUserId } from '../routes/types';
import { UserNotFoundException } from '../services/user/user.exceptions';
import { UserService } from '../services/user/user.service';
import { serializeError } from '../utils/serialize_error';
import { Loggable } from './loggable.middleware';

export const JWTAuthenticator = (userService: UserService) => {
  class JWTAuthenticatorClass {
    @Loggable
    async authenticateJWT(
      req: RequestWithUserId,
      res: Response,
      next: () => void
    ) {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (!token) {
          return res
            .status(403)
            .json(serializeError('Se requiere un token válido para el acceso'));
        }

        try {
          const decoded: any = jwt.verify(token, process.env.TOKEN_KEY!);
          const user = await userService.getUserById(decoded.id);

          req.userId = user.id;
        } catch (error) {
          if (error instanceof UserNotFoundException) {
            return res.status(404).json(serializeError(error.message));
          }

          return res.status(401).json(serializeError('El token es inválido'));
        }

        return next();
      } else {
        res.status(401).json(serializeError('No tienes permisos para acceder'));
      }
    }
  }

  return new JWTAuthenticatorClass();
};
