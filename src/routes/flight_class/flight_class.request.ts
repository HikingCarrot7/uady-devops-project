import { IsEnum, IsNumber, Min } from 'class-validator';
import { CabinClass } from './../../entities/flight_class.entity';

export class FlightClassRequest {
  @IsNumber({}, { message: 'El precio debe ser numérico.' })
  @Min(0, { message: 'El precio no debe ser menor a 0.' })
  price: number = 0;

  @IsEnum(CabinClass, { message: 'La clase debe ser un valor permitido.' })
  cabinClass: CabinClass = CabinClass.ECONOMY;
}
