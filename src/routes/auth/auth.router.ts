import { Response, Router } from 'express';
import { User } from '../../entities/user.entity';
import { Loggable } from '../../middleware/loggable.middleware';
import { AuthService } from '../../services/auth/auth.service';
import {
  EmailAlreadyTakenException,
  InvalidPasswordException,
  UserNotRegisteredException,
} from '../../services/user/user.exceptions';
import { serializeError } from '../../utils/serialize_error';
import { validate } from '../../utils/validation';
import { RequestWithUserId } from '../types';
import { UserRequest } from '../user/user.request';
import { LoginRequest } from './login.request';

export const AuthRouter = (router: Router, authService: AuthService) => {
  class AuthRouterClass {
    constructor() {
      router.route('/login').post(validate(LoginRequest), this.login);
      router.route('/register').post(validate(UserRequest), this.register);
      router.route('/health').get(this.health);
    }

    @Loggable()
    async login(req: RequestWithUserId, res: Response) {
      const { email, password } = req.body;

      try {
        const { username, token } = await authService.login(email, password);

        return res.status(200).json({ username, token });
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

    @Loggable()
    async register(req: RequestWithUserId, res: Response) {
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

    async health(req: any, res: Response) {
      return res.status(200).json({ status: 'Ok' });
    }
  }

  return new AuthRouterClass();
};
