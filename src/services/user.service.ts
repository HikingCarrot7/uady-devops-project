import { User } from 'entities/user.entity';
import { UserRepository } from 'repositories/user.repository';

export const UserService = (userRepository: UserRepository) => {
  const getAllUsers = async () => {
    return await userRepository.find();
  };

  const getUserById = async (id: string) => {
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return Promise.reject('ID inválido');
    }

    return await userRepository.find({ id: parsedId });
  };

  const createUser = async (user: User) => {
    // Hashear el password.

    const newUser = await userRepository.save(user);

    return newUser;
  };

  return { getAllUsers, getUserById, createUser };
};
