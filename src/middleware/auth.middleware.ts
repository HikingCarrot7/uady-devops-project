import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserNotFoundException } from '../services/user/user.exceptions';
import { UserService } from '../services/user/user.service';
import { serializeError } from '../utils/serializeError';

// No sé donde poner esto, ni el nombre que podría tener. @Shadic78
export interface MyContext extends Request {
  userId?: number;
}

export const authenticateJWT = (userService: UserService) => {
  return async (req: MyContext, res: Response, next: () => void) => {
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
      } catch (err) {
        if (err instanceof UserNotFoundException) {
          return res.status(404).json(serializeError(err.message));
        }

        return res.status(401).json(serializeError('El token es inválido'));
      }

      return next();
    } else {
      res.status(401).json(serializeError('No tienes permisos para acceder'));
    }
  };
};
