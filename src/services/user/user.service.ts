import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import {
  EmailAlreadyTakenException,
  UserNotFoundException,
} from './user.exceptions';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ email });
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);

    return !!user;
  }

  async createUser(user: User): Promise<User> {
    const emailTaken = await this.isEmailTaken(user.email);

    if (emailTaken) {
      throw new EmailAlreadyTakenException();
    }

    user.password = await this.hashPassword(user.password);

    return await this.userRepository.save(user);
  }

  async updateUser(id: number, providedUser: User): Promise<User> {
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
  }

  async deleteUserById(id: number): Promise<User> {
    const userToDelete = await this.getUserById(id);

    await this.userRepository.delete({ id });

    return userToDelete;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
