import { IsNotEmpty, IsPositive, Max } from 'class-validator';

export class FlightTicketRequest {
  @IsNotEmpty({ message: 'Se debe especificar el id del vuelo.' })
  @IsPositive({ message: 'El id del vuelo debe ser mayor a 0.' })
  flightId: number = 0;

  @IsPositive({ message: 'El id de la clase del vuelo debe ser mayor a 0.' })
  flightClassId: number = 0;

  @IsPositive({ message: 'El número de pasajeros debe ser mayor a 0.' })
  @Max(30, { message: 'Se acepta hasta un máximo de 30 pasajeros por ticket.' })
  passengers: number = 0;
}
