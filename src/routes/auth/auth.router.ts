import { Response, Router } from 'express';
import { User } from '../../entities/user.entity';
import { MyContext } from '../../middleware/auth.middleware';
import { Loggable } from '../../middleware/loggable.middleware';
import { AuthService } from '../../services/auth/auth.service';
import {
  EmailAlreadyTakenException,
  InvalidPasswordException,
  UserNotRegisteredException,
} from '../../services/user/user.exceptions';
import { serializeError } from '../../utils/serialize_error';
import { validate } from '../../utils/validation';
import { UserRequest } from '../user/user.request';
import { LoginRequest } from './login.request';

export const AuthRouter = (router: Router, authService: AuthService) => {
  class AuthRouterClass {
    constructor() {
      router.route('/login').post(validate(LoginRequest), this.login);
      router.route('/register').post(validate(UserRequest), this.register);
    }

    @Loggable
    async login(req: MyContext, res: Response) {
      const { email, password } = req.body;

      try {
        const token = await authService.login(email, password);

        return res.status(200).json({ token });
      } catch (error) {
        if (error instanceof UserNotRegisteredException) {
          return res.status(404).json(serializeError(error.message));
        }

        if (error instanceof InvalidPasswordException) {
          return res.status(400).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async register(req: MyContext, res: Response) {
      const providedUser = req.body;

      try {
        const newUser = await authService.register(new User(providedUser));

        return res.status(200).json(newUser);
      } catch (error) {
        if (error instanceof EmailAlreadyTakenException) {
          return res.status(409).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }
  }

  return new AuthRouterClass();
};
