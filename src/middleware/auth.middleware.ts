import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user/user.service';

export const authenticateJWT = (userService: UserService) => {
  return async (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      if (!token) {
        return res
          .status(403)
          .json({ error: 'Se requiere un token válido para el acceso' });
      }

      try {
        const decoded: any = jwt.verify(token, process.env.TOKEN_KEY!);

        const existsUser = await userService.isEmailTaken(decoded.email);

        if (!existsUser) {
          return res
            .status(404)
            .json({ error: 'El usuario no está registardo!' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'El token es inválido' });
      }

      return next();
    } else {
      res.status(401).json({ error: 'No tienes permisos para acceder' });
    }
  };
};
