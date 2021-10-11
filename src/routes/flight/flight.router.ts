import { Request, Response, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Flight } from '../../entities/flight.entity';
import { FlightRepository } from '../../repositories/flight.repository';
import { FlightService } from '../../services/flight.service';
import { validate } from '../../utils/validation';
import { FlightRequest } from './flight.request';

export const FlightRouter = () => {
  const flightService = FlightService(getCustomRepository(FlightRepository));

  const getAllFlights = async (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ flights: await flightService.getAllFlights() });
  };

  const getFlightById = async (req: Request, res: Response) => {
    const flightId = req.params.id;

    try {
      return res
        .status(200)
        .json({ flight: await flightService.getFlightById(flightId) });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

  const createFlight = async (req: Request, res: Response) => {
    const flightRequest = req.body as FlightRequest;

    try {
      const newFlight = await flightService.createFlight(
        new Flight({ ...flightRequest })
      );

      return res.status(200).json({ site: newFlight });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  const deleteFlightById = async (req: Request, res: Response) => {
    const flightId = req.params.id;

    try {
      return res
        .status(200)
        .json({ flight: await flightService.deleteFlightById(flightId) });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

  const updateFlight = async (req: Request, res: Response) => {
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
  };

  const router = Router();

  router
    .route('/flights')
    .get(getAllFlights)
    .post(validate(FlightRequest), createFlight);

  router
    .route('/flights/:id')
    .get(getFlightById)
    .delete(deleteFlightById)
    .put(validate(FlightRequest), updateFlight);

  return { router };
};
