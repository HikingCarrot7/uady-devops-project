import { IsNumber, IsPositive } from 'class-validator';

export class FlightTicketRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  userId: number = 0;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  flightId: number = 0;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  flightClassId: number = 0;

  @IsPositive()
  passengers: number = 0;
}
