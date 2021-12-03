import { IsOptional } from 'class-validator';
import { FlightRequest } from './flight.request';

export class UpdateFlightRequest extends FlightRequest {
  @IsOptional()
  date: string = '';

  @IsOptional()
  hour: string = '';

  @IsOptional()
  estimatedHours: number = 0;

  @IsOptional()
  takeOffSiteId: number = 0;

  @IsOptional()
  landingSiteId: number = 0;
}
