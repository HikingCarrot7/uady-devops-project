import { Request, Response, Router } from 'express';
import { User } from '../../entities/user.entity';
import { AuthService } from '../../services/auth/auth.service';
import {
  InvalidPasswordException,
  UserAlreadyExistsException,
  UserNotRegisteredException,
} from '../../services/user/user.exceptions';
import { validate } from '../../utils/validation';
import { UserRequest } from '../user/user.request';
import { LoginRequest } from './login.request';

export const AuthRouter = (authService: AuthService) => {
  const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginRequest;

    try {
      const token = await authService.login(email, password);

      return res.status(200).json({ token });
    } catch (error) {
      if (error instanceof UserNotRegisteredException) {
        return res.status(404).json({ error: error.message });
      }

      if (error instanceof InvalidPasswordException) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error });
    }
  };

  const register = async (req: Request, res: Response) => {
    const providedUser = req.body as UserRequest;

    try {
      const newUser = await authService.register(new User(providedUser));

      return res.status(200).json({ ...newUser });
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        return res.status(409).json({ error: error.message });
      }

      return res.status(500).json({ error });
    }
  };

  const router = Router();

  router.route('/register').post(validate(UserRequest), register);
  router.route('/login').post(validate(LoginRequest), login);

  return { router, routes: { login, register } };
};
