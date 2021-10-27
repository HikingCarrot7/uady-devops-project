import { IsOptional } from 'class-validator';

export class UpdateFlightTicketRequest {
  @IsOptional()
  flightId: number = 0;

  @IsOptional()
  flightClassId: number = 0;

  @IsOptional()
  passengers: number = 0;
}
