import { classToPlain } from 'class-transformer';
import { Response, Router } from 'express';
import { Loggable } from '../../middleware/loggable.middleware';
import {
  EmailAlreadyTakenException,
  UserNotFoundException,
} from '../../services/user/user.exceptions';
import { UserService } from '../../services/user/user.service';
import { serializeError } from '../../utils/serialize_error';
import { validate } from '../../utils/validation';
import { RequestWithUserId } from '../types';
import { User } from './../../entities/user.entity';
import { UpdateUserRequest } from './update_user.request';
import { UserRequest } from './user.request';

export const UserRouter = (router: Router, userService: UserService) => {
  class UserRouterClass {
    constructor() {
      router
        .route('/users')
        .get(this.getAllUsers)
        .post(validate(UserRequest), this.createUser)
        .put(validate(UpdateUserRequest), this.updateSelf)
        .delete(this.deleteSelf);

      router
        .route('/users/:id')
        .get(this.getUserById)
        .put(validate(UpdateUserRequest), this.updateUser)
        .delete(this.deleteUser);
    }

    @Loggable
    async getAllUsers(req: RequestWithUserId, res: Response) {
      try {
        const users = await userService.getAllUsers();

        return res.status(200).json(classToPlain(users));
      } catch (error) {
        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async getUserById(req: RequestWithUserId, res: Response) {
      const userId = parseInt(req.params.id);

      try {
        const user = await userService.getUserById(userId);

        return res.status(200).json(classToPlain(user));
      } catch (error) {
        if (error instanceof UserNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async createUser(req: RequestWithUserId, res: Response) {
      const userRequest = req.body;

      try {
        const newUser = await userService.createUser(new User(userRequest));

        return res.status(201).json(classToPlain(newUser));
      } catch (error) {
        if (error instanceof EmailAlreadyTakenException) {
          return res.status(409).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async updateSelf(req: RequestWithUserId, res: Response) {
      const userId = req.userId!!;
      req.params.id = `${userId}`;

      return UserRouterClass.prototype.updateUser(req, res);
    }

    @Loggable
    async updateUser(req: RequestWithUserId, res: Response) {
      const userId = parseInt(req.params.id);
      const providedUser = req.body;

      try {
        const updatedUser = await userService.updateUser(userId, providedUser);

        return res.status(200).json(classToPlain(updatedUser));
      } catch (error) {
        if (error instanceof UserNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        if (error instanceof EmailAlreadyTakenException) {
          return res.status(409).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async deleteSelf(req: RequestWithUserId, res: Response) {
      const userId = req.userId!!;
      req.params.id = `${userId}`;

      return UserRouterClass.prototype.deleteUser(req, res);
    }

    @Loggable
    async deleteUser(req: RequestWithUserId, res: Response) {
      const userId = parseInt(req.params.id);

      try {
        const deletedUser = await userService.deleteUserById(userId);

        return res.status(200).json(classToPlain(deletedUser));
      } catch (error) {
        if (error instanceof UserNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }
  }

  return new UserRouterClass();
};
