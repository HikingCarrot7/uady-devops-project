import { IsNotEmpty, IsPositive, Length } from 'class-validator';

export class SiteRequest {
  @IsNotEmpty({ message: 'Se debe especificar el id del país.' })
  @IsPositive({ message: 'El id del país debe ser un número mayor a 0.' })
  country: number = 0;

  @IsNotEmpty({ message: 'Se debe especificar un estado.' })
  @Length(3, 50, { message: 'El estado debe tener entre 3 y 50 caracteres.' })
  state: string = '';

  @IsNotEmpty({ message: 'Se debe especificar una ciudad.' })
  @Length(3, 50, { message: 'La ciudad debe tener entre 3 y 50 caracteres.' })
  city: string = '';
}
