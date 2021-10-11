import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  getAllUsers = async () => {
    return await this.userRepository.find();
  };

  getUserById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await this.userRepository.findOne({ id });
  };

  createUser = async (user: User) => {
    const userIsRegistered = await this.isUserRegistered(user);

    if (userIsRegistered) {
      return Promise.reject('El email ya esta registrado');
    }

    user.password = await this.hashPassword(user.password);

    return await this.userRepository.save(user);
  };

  deleteUserById = async (id: number | string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await this.userRepository.delete({ id });
  };

  updateUser = async (id: string, newUserData: User) => {
    const result = await this.getUserById(id);
    const newPassword = await this.hashPassword(newUserData.password);
    const updatedUser = { ...result, ...newUserData, password: newPassword };

    return await this.userRepository.save(updatedUser);
  };

  hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  getUserByEmail = async (email: string) => {
    return await this.userRepository.findOne({ email });
  };

  isUserRegistered = async (user: User) => {
    return await this.getUserByEmail(user.email);
  };
}
