import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../entities/user.entity';
import {
  InvalidPasswordException,
  UserNotRegisteredException,
} from '../user/user.exceptions';
import { UserService } from '../user/user.service';

export class AuthService {
  constructor(private userService: UserService) {}

  async login(
    email: string,
    password: string,
    // Para propósitos de prueba.
    compareFunction?: (password: string, hashedPassword: string) => boolean
  ) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UserNotRegisteredException();
    }

    if (compareFunction) {
      if (compareFunction(password, user.password)) {
        return this.createToken(user.id, email);
      }

      throw new InvalidPasswordException();
    }

    if (await bcrypt.compare(password, user.password)) {
      return this.createToken(user.id, email);
    }

    throw new InvalidPasswordException();
  }

  async register(provideUser: User) {
    const newUser = await this.userService.createUser(provideUser);

    const { id, email } = newUser;

    const token = this.createToken(id, email);

    return { ...newUser, token };
  }

  private createToken(userId: number, email: string) {
    return jwt.sign({ id: userId, email }, process.env.TOKEN_KEY!, {
      expiresIn: '5h',
    });
  }
}
