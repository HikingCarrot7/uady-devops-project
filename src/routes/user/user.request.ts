import { IsNotEmpty, Length } from 'class-validator';
import { LoginRequest } from '../auth/login.request';

export class UserRequest extends LoginRequest {
  @IsNotEmpty({ message: 'Se necesita un nombre de usuario para el registro.' })
  @Length(3, 35, { message: 'El nombre debe tener entre 5 y 35 caracteres.' })
  username: string = '';
}
