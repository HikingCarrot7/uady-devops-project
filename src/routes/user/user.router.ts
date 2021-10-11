import { Request, Response, Router } from 'express';
import { UserService } from '../../services/user/user.service';
import { validate } from '../../utils/validation';
import { User } from './../../entities/user.entity';
import { UserRequest } from './user.request';

export const UserRouter = (userService: UserService) => {
  const getAllUsers = async (req: Request, res: Response) => {
    try {
      return res.status(200).json({ users: await userService.getAllUsers() });
    } catch(error) {
      return res.status(500).json({ error });
    }
  };

  const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      return res
        .status(200)
        .json({ user: await userService.getUserById(userId) });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  const createUser = async (req: Request, res: Response) => {
    const userRequest = req.body as UserRequest;

    try {
      const newUser = await userService.createUser(
        new User({ ...userRequest })
      );

      return res.status(201).json({ user: newUser });
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

  return {
    router,
    routes: {
      getAllUsers,
      getUserById,
      createUser,
      updateUser,
      deleteUser,
    }
  };
};
