import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export const AuthService = (userRepository: Repository<User>) => {};
