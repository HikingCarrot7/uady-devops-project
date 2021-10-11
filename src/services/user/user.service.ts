import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';
import { UserAlreadyExistsException } from './user.exceptions';

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

  getUserByEmail = async (email: string) => {
    return await this.userRepository.findOne({ email });
  };

  isEmailTaken = async (email: string) => {
    return await this.getUserByEmail(email);
  };

  createUser = async (user: User) => {
    const emailTaken = await this.isEmailTaken(user.email);

    if (emailTaken) {
      throw new UserAlreadyExistsException();
    }

    user.password = await this.hashPassword(user.password);

    return await this.userRepository.save(user);
  };

  updateUser = async (id: string, newUserData: User) => {
    const result = await this.getUserById(id);
    const newPassword = await this.hashPassword(newUserData.password);
    const updatedUser = { ...result, ...newUserData, password: newPassword };

    return await this.userRepository.save(updatedUser);
  };

  deleteUserById = async (id: number | string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await this.userRepository.delete({ id });
  };

  hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };
}
