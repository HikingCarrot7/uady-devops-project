import { Request, Response, Router } from 'express';
import { Loggable } from '../../middleware/loggable.middleware';
import { FlightClassNotFoundException } from '../../services/flight_class/flight_class.exeptions';
import { FlightClassService } from '../../services/flight_class/flight_class.service';
import { serializeError } from '../../utils/serialize_error';

export const FlightClassRouter = (
  router: Router,
  flightClassService: FlightClassService
) => {
  class FlightClass {
    constructor() {
      router.route('/flights-classes').get(this.getAllFlightsClasses);
      router.route('/flights-classes/:id').get(this.getFlightClassById);
    }

    @Loggable
    async getAllFlightsClasses(req: Request, res: Response) {
      try {
        const flightClasses = await flightClassService.getAllFlightsClasses();

        return res.status(200).json(flightClasses);
      } catch (error) {
        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async getFlightClassById(req: Request, res: Response) {
      const flightClassId = parseInt(req.params.id);

      try {
        const flightClass = await flightClassService.getFlightClassById(
          flightClassId
        );

        return res.status(200).json(flightClass);
      } catch (error) {
        if (error instanceof FlightClassNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }
  }

  return new FlightClass();
};
