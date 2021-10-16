import { classToPlain } from 'class-transformer';
import { Response, Router } from 'express';
import { MyContext } from '../../middleware/auth.middleware';
import {
  EmailAlreadyTakenException,
  UserNotFoundException,
} from '../../services/user/user.exceptions';
import { UserService } from '../../services/user/user.service';
import { serializeError } from '../../utils/serializeError';
import { validate } from '../../utils/validation';
import { User } from './../../entities/user.entity';
import { UpdateUserRequest } from './update-user.request';
import { UserRequest } from './user.request';

export const UserRouter = (userService: UserService) => {
  const getAllUsers = async (req: MyContext, res: Response) => {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json(classToPlain(users));
    } catch {
      return res.sendStatus(500);
    }
  };

  const getUserById = async (req: MyContext, res: Response) => {
    const userId = req.params.id;

    try {
      const user = await userService.getUserById(userId);

      return res.status(200).json(classToPlain(user));
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        return res.status(404).json(serializeError(error.message));
      }

      return res.sendStatus(500);
    }
  };

  const createUser = async (req: MyContext, res: Response) => {
    const userRequest = req.body;

    try {
      const newUser = await userService.createUser(new User(userRequest));

      return res.status(201).json(classToPlain(newUser));
    } catch (error) {
      if (error instanceof EmailAlreadyTakenException) {
        return res.status(409).json(serializeError(error.message));
      }

      return res.sendStatus(500);
    }
  };

  const updateSelf = async (req: MyContext, res: Response) => {
    if (req.userId) {
      req.params.id = `${req.userId}`;
      return updateUser(req, res);
    }

    return res.sendStatus(500);
  };

  const updateUser = async (req: MyContext, res: Response) => {
    const userId = req.params.id;
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

      return res.sendStatus(500);
    }
  };

  const deleteSelf = async (req: MyContext, res: Response) => {
    if (req.userId) {
      req.params.id = `${req.userId}`;
      return deleteUser(req, res);
    }

    return res.sendStatus(500);
  };

  const deleteUser = async (req: MyContext, res: Response) => {
    const userId = req.params.id;

    try {
      const deletedUser = await userService.deleteUserById(userId);

      return res.status(200).json(classToPlain(deletedUser));
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        return res.status(404).json(serializeError(error.message));
      }

      return res.sendStatus(500);
    }
  };

  const router = Router();

  router
    .route('/users')
    .get(getAllUsers)
    .post(validate(UserRequest), createUser)
    .put(validate(UpdateUserRequest), updateSelf)
    .delete(deleteSelf);

  router
    .route('/users/:id')
    .get(getUserById)
    .put(validate(UpdateUserRequest), updateUser)
    .delete(deleteUser);

  return {
    router,
    routes: {
      getAllUsers,
      getUserById,
      createUser,
      updateUser,
      deleteUser,
    },
  };
};
