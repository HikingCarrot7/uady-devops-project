import { Matches, IsNumber, Min, Max } from 'class-validator';

export class FlightRequest {
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: 'La fecha debe tener el formato YYYY-MM-DD',
  })
  date: string = '';

  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe tener el formato HH:MM (24 horas).',
  })
  hour: string = '';

  @IsNumber(
    {},
    { message: 'El tiempo estimado debe ser numérico y estar entre 0 y 100.' }
  )
  @Min(0, { message: 'El tiempo estimado no debe ser menor a 0.' })
  @Max(100, { message: 'El tiempo estimado no debe ser mayor a 100.' })
  estimatedHours: number = 0;
}
