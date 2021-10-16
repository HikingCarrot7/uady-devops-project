import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';
import {
  EmailAlreadyTakenException,
  UserNotFoundException,
} from './user.exceptions';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  getAllUsers = async (): Promise<User[]> => {
    return await this.userRepository.find();
  };

  getUserById = async (id: number | string): Promise<User> => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  };

  getUserByEmail = async (email: string): Promise<User | undefined> => {
    return await this.userRepository.findOne({ email });
  };

  isEmailTaken = async (email: string) => {
    const user = await this.getUserByEmail(email);

    return !!user;
  };

  createUser = async (user: User): Promise<User> => {
    const emailTaken = await this.isEmailTaken(user.email);

    if (emailTaken) {
      throw new EmailAlreadyTakenException();
    }

    user.password = await this.hashPassword(user.password);

    return await this.userRepository.save(user);
  };

  updateUser = async (
    id: number | string,
    providedUser: User
  ): Promise<User> => {
    const actualUser = await this.getUserById(id);
    const userWithEmail = await this.getUserByEmail(providedUser.email);

    const emailTaken = userWithEmail && actualUser.id !== userWithEmail.id;

    if (emailTaken) {
      throw new EmailAlreadyTakenException(providedUser.email);
    }

    let newPassword = actualUser.password;

    if (providedUser.password) {
      newPassword = await this.hashPassword(providedUser.password);
    }

    const updatedUser = new User({
      ...actualUser,
      ...providedUser,
      password: newPassword,
    });

    await this.userRepository.save(updatedUser);

    return await this.getUserById(id);
  };

  deleteUserById = async (id: number | string): Promise<User> => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    const userToDelete = await this.getUserById(id);

    await this.userRepository.delete({ id });

    return userToDelete;
  };

  hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };
}
