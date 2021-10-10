import { IsEmail, Length } from 'class-validator';

export class UserRequest {
  @Length(1, 50, { message: 'El nombre debe tener entre 1 y 50 caracteres' })
  name: string = '';

  @IsEmail({}, { message: 'El email es inválido' })
  email: string = '';

  @Length(6, 16, {
    message: 'La contraseña debe tener entre 6 y 16 caracteres',
  })
  password: string = '';
}
