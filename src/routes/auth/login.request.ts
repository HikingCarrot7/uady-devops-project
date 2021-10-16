import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty({ message: 'Se necesita un email para registrarse.' })
  @IsEmail({}, { message: 'El email es inválido.' })
  email: string = '';

  @IsNotEmpty({ message: 'Se necesita una contraseña para el registro.' })
  @Length(8, 16, {
    message: 'La contraseña debe tener entre 8 y 16 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/, {
    message:
      'La constraseña debe tener al menos 8 caracteres, 1 letra mayúscula, 1 letra minúscula y 1 número.',
  })
  password: string = '';
}
