import { classToPlain } from 'class-transformer';
import { Request, Response, Router } from 'express';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../../services/user/user.exceptions';
import { UserService } from '../../services/user/user.service';
import { validate } from '../../utils/validation';
import { User } from './../../entities/user.entity';
import { UserRequest } from './user.request';

export const UserRouter = (userService: UserService) => {
  const getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json(classToPlain(users));
    } catch {
      return res.sendStatus(500);
    }
  };

  const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      const user = await userService.getUserById(userId);

      return res.status(200).json(classToPlain(user));
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        return res.status(404).json({ error: error.message });
      }

      return res.sendStatus(500);
    }
  };

  const createUser = async (req: Request, res: Response) => {
    const userRequest = req.body as UserRequest;

    try {
      const newUser = await userService.createUser(new User(userRequest));

      return res.status(201).json(classToPlain(newUser));
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        return res.status(409).json({ error: error.message });
      }

      return res.sendStatus(500);
    }
  };

  const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const providedUser = req.body;

    try {
      const updatedUser = await userService.updateUser(userId, providedUser);

      return res.status(200).json(classToPlain(updatedUser));
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      const deletedUser = await userService.deleteUserById(userId);

      return res.status(200).json(classToPlain(deletedUser));
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  const router = Router();

  router
    .route('/users')
    .get(getAllUsers)
    .post(validate(UserRequest), createUser);

  router
    .route('/users/:id')
    .get(getUserById)
    .delete(deleteUser)
    .put(validate(UserRequest), updateUser);

  return { router };
};
