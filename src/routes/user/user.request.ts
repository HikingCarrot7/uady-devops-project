import { Length } from 'class-validator';
import { LoginRequest } from '../auth/login.request';

export class UserRequest extends LoginRequest {
  @Length(3, 35, { message: 'El nombre debe tener entre 3 y 35 caracteres' })
  name: string = '';
}
