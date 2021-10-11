import { IsEmail, Length } from 'class-validator';

export class LoginRequest {
  @IsEmail({}, { message: 'El email es inválido' })
  email: string = '';

  @Length(6, 16, {
    message: 'La contraseña debe tener entre 6 y 16 caracteres',
  })
  password: string = '';
}
