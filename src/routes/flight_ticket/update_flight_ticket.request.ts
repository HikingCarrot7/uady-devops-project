import { IsOptional } from 'class-validator';
import { FlightTicketRequest } from './flight_ticket.request';

export class UpdateFlightTicketRequest extends FlightTicketRequest {
  @IsOptional()
  userId: number = 0;

  @IsOptional()
  flightId: number = 0;

  @IsOptional()
  flightClassId: number = 0;

  @IsOptional()
  passengers: number = 0;
}
