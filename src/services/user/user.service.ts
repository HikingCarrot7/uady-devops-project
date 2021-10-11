import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';

export const UserService = (userRepository: UserRepository) => {
  const getAllUsers = async () => {
    return await userRepository.find();
  };

  const getUserById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await userRepository.findOne({ id });
  };

  const createUser = async (user: User) => {
    const userIsRegistered = await isUserRegistered(user);

    if (userIsRegistered) {
      return Promise.reject('El email ya esta registrado');
    }

    user.password = await hashPassword(user.password);

    return await userRepository.save(user);
  };

  const deleteUserById = async (id: number | string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await userRepository.delete({ id });
  };

  const updateUser = async (id: string, newUserData: User) => {
    const result = await getUserById(id);
    const newPassword = await hashPassword(newUserData.password);
    const updatedUser = { ...result, ...newUserData, password: newPassword };

    return await userRepository.save(updatedUser);
  };

  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  const getUserByEmail = async (email: string) => {
    return await userRepository.findOne({ email });
  };

  const isUserRegistered = async (user: User) => {
    return await getUserByEmail(user.email);
  };

  return { getAllUsers, getUserById, createUser, deleteUserById, updateUser };
};
