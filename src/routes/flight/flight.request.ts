import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { NotMatch } from '../../utils/match.decorator';

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

  @IsNotEmpty({ message: 'Se debe especificar el id del sitio de origen.' })
  @IsPositive({
    message: 'El id del sitio de origen debe ser un número mayor a 0.',
  })
  takeOffSiteId: number = 0;

  @NotMatch('takeOffSiteId', {
    message: 'El id del sitio de origen y destino tienen que ser diferentes.',
  })
  @IsNotEmpty({ message: 'Se debe especificar el id del sitio de destino.' })
  @IsPositive({
    message: 'El id del sitio de destino debe ser un número mayor a 0.',
  })
  landingSiteId: number = 0;
}
