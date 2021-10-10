import { User } from 'entities/user.entity';
import { UserRepository } from 'repositories/user.repository';
import * as bcrypt from 'bcrypt';

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
    const userIsRegistered = getUserByEmail(user.email);
    if(userIsRegistered) {
      return Promise.reject('El email ya esta registrado');
    }
    user.password = await hashPassword(user.password);
    const newUser = await userRepository.save(user);
    return newUser;
  };

  const deleteUserById = async (id: string) => {
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) {
      return Promise.reject('ID inválido');
    }
    return await userRepository.delete({ id: parsedId });
  };

  const updateUser = async (id: string, newUserData: User) => {
    const result = await getUserById(id);
    const newPassword = await hashPassword(newUserData.password);
    const updatedUser = {...result, ...newUserData, password: newPassword};
    return await userRepository.save(updatedUser);
  };  

  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  }  

  const getUserByEmail = async (email: string) => {
    const user = await userRepository.findOne({ email });
    if (!user) {
      return Promise.reject(`No se encontro un usuario con el email: ${email}`);
    }
    return user;
  }  

  return { getAllUsers, getUserById, createUser, deleteUserById, updateUser };
};
