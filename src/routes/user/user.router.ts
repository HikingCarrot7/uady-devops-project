import { Request, Response, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../../services/user.service';
import { validate } from '../../utils/validation';
import { User } from './../../entities/user.entity';
import { UserRequest } from './user.request';

export const UserRouter = () => {
  const userService = UserService(getCustomRepository(UserRepository));

  const getAllUsers = async (req: Request, res: Response) => {
    return res.status(200).json({ users: await userService.getAllUsers() });
  };

  const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      return res
        .status(200)
        .json({ user: await userService.getUserById(userId) });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

  const createUser = async (req: Request, res: Response) => {
    const userRequest = req.body as UserRequest;

    try {
      const newUser = await userService.createUser(
        new User({ ...userRequest })
      );

      return res.status(200).json({ user: newUser });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userData = req.body;
    try {
      return res
        .status(200)
        .json({ user: await userService.updateUser(userId, userData) });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }       
  };

  const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
      return res
        .status(200)
        .json({ user: await userService.deleteUserById(userId) });
    } catch (error) {
      console.log(error);
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
