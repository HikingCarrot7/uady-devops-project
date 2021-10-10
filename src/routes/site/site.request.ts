import { Length, IsNumber } from 'class-validator';

export class SiteRequest {
  @Length(5, 50, { message: 'El país debe tener entre 5 y 50 caracteres' })
  country: string = '';

  @Length(5, 50, { message: 'La ciudad debe tener entre 5 y 50 caracteres' })
  city: string = '';

  @Length(5, 50, { message: 'El estado debe tener entre 5 y 50 caracteres' })
  state: string = '';

  @IsNumber({}, { message: 'El código debe ser numérico' })
  code: string = '';  
}