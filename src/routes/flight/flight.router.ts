import { Request, Response, Router } from 'express';
import { Flight } from '../../entities/flight.entity';
import { Loggable } from '../../middleware/loggable.middleware';
import {
  FlightNotFoundException,
  InvalidFlightException,
} from '../../services/flight/flight.exceptions';
import { FlightService } from '../../services/flight/flight.service';
import { SiteNotFoundException } from '../../services/site/site.exceptions';
import { serializeError } from '../../utils/serialize_error';
import { validate } from '../../utils/validation';
import { FlightRequest } from './flight.request';
import { UpdateFlightRequest } from './update_flight.request';

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
        .put(validate(UpdateFlightRequest), this.updateFlight);
    }

    @Loggable
    async getAllFlights(req: Request, res: Response) {
      try {
        const flights = await flightService.getAllFlights();

        return res.status(200).json(flights);
      } catch (error) {
        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async getFlightById(req: Request, res: Response) {
      const flightId = parseInt(req.params.id);

      try {
        const flight = await flightService.getFlightById(flightId);

        return res.status(200).json(flight);
      } catch (error) {
        if (error instanceof FlightNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async createFlight(req: Request, res: Response) {
      const { takeOffSiteId, landingSiteId, ...flightRequest } = req.body;

      try {
        const newFlight = await flightService.createFlight(
          takeOffSiteId,
          landingSiteId,
          new Flight(flightRequest)
        );

        return res.status(201).json(newFlight);
      } catch (error) {
        if (error instanceof InvalidFlightException) {
          return res.status(400).json(serializeError(error.message));
        }

        if (error instanceof SiteNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async updateFlight(req: Request, res: Response) {
      const flightId = parseInt(req.params.id);
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

    @Loggable
    async deleteFlightById(req: Request, res: Response) {
      const flightId = parseInt(req.params.id);

      try {
        const deletedFlight = await flightService.deleteFlightById(flightId);

        return res.status(200).json(deletedFlight);
      } catch (error) {
        if (error instanceof FlightNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }
  }

  return new FlightRouterClass();
};
