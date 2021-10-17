import { IsNotEmpty, IsNumber, IsPositive, Length } from 'class-validator';

export class SiteRequest {
  @IsNotEmpty({ message: 'Se debe especificar el id del país.' })
  @IsNumber({}, { message: 'El id del país debe ser un número.' })
  @IsPositive({ message: 'El id del país debe ser mayor a 0.' })
  countryId: number = 0;

  @IsNotEmpty({ message: 'Se debe especificar un estado.' })
  @Length(3, 50, { message: 'El estado debe tener entre 3 y 50 caracteres.' })
  state: string = '';

  @IsNotEmpty({ message: 'Se debe especificar una ciudad.' })
  @Length(3, 50, { message: 'La ciudad debe tener entre 3 y 50 caracteres.' })
  city: string = '';
}
