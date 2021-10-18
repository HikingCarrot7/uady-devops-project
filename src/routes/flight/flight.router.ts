import { Request, Response, Router } from 'express';
import { Flight } from '../../entities/flight.entity';
import { Loggable } from '../../middleware/loggable.middleware';
import { FlightService } from '../../services/flight/flight.service';
import { validate } from '../../utils/validation';
import { FlightRequest } from './flight.request';

export const FlightRouter = (router: Router, flightService: FlightService) => {
  class FlightRouterClass {
    constructor() {
      router
        .route('/flights')
        .get(this.getAllFlights)
        .post(validate(FlightRequest), this.createFlight);

      router
        .route('/flights/:id')
        .get(this.getFlightById)
        .delete(this.deleteFlightById)
        .put(validate(FlightRequest), this.updateFlight);
    }

    @Loggable
    async getAllFlights(req: Request, res: Response) {
      return res
        .status(200)
        .json({ flights: await flightService.getAllFlights() });
    }

    @Loggable
    async getFlightById(req: Request, res: Response) {
      const flightId = req.params.id;

      try {
        return res
          .status(200)
          .json({ flight: await flightService.getFlightById(flightId) });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
      }
    }

    @Loggable
    async createFlight(req: Request, res: Response) {
      const flightRequest = req.body as FlightRequest;

      try {
        const newFlight = await flightService.createFlight(
          new Flight({ ...flightRequest })
        );

        return res.status(201).json({ flight: newFlight });
      } catch (error) {
        return res.status(400).json({ error });
      }
    }

    @Loggable
    async deleteFlightById(req: Request, res: Response) {
      const flightId = req.params.id;

      try {
        return res
          .status(200)
          .json({ flight: await flightService.deleteFlightById(flightId) });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
      }
    }

    @Loggable
    async updateFlight(req: Request, res: Response) {
      const flightId = req.params.id;
      const flightData = req.body;

      try {
        return res.status(200).json({
          flight: await flightService.updateFlight(flightId, flightData),
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
      }
    }
  }

  return new FlightRouterClass();
};
