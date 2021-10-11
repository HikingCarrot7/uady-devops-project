import { Request, Response, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { FlightClassRepository } from '../../repositories/flight_class.repository';
import { FlightClassService } from '../../services/flight_class.service';
import { validate } from '../../utils/validation';
import { FlightClass } from '../../entities/flight_class.entity';
import { FlightClassRequest } from './flight_class.request';

export const FlightClassRouter = () => {
  const flightClassService = FlightClassService(
    getCustomRepository(FlightClassRepository)
  );

  const getAllFlightsClasses = async (req: Request, res: Response) => {
    return res.status(200).json({
      flightsClasses: await flightClassService.getAllFlightsClasses(),
    });
  };

  const getFlightClassById = async (req: Request, res: Response) => {
    const flightClassId = req.params.id;

    try {
      return res.status(200).json({
        flightClass: await flightClassService.getFlightClassById(flightClassId),
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

  const createFlightClass = async (req: Request, res: Response) => {
    const flightClassRequest = req.body as FlightClassRequest;

    try {
      const newFlightClass = await flightClassService.createFlightClass(
        new FlightClass({ ...flightClassRequest })
      );

      return res.status(200).json({ flightClass: newFlightClass });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  const deleteFlightClassById = async (req: Request, res: Response) => {
    const flightClassId = req.params.id;

    try {
      return res.status(200).json({
        flightClass: await flightClassService.deleteFlightClassById(
          flightClassId
        ),
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

  const updateFlightClass = async (req: Request, res: Response) => {
    const flightClassId = req.params.id;
    const flightClassData = req.body;

    try {
      return res.status(200).json({
        flightClass: await flightClassService.updateFlightClass(
          flightClassId,
          flightClassData
        ),
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

  const router = Router();

  router
    .route('/flights-classes')
    .get(getAllFlightsClasses)
    .post(validate(FlightClassRequest), createFlightClass);
  router
    .route('/flights-classes/:id')
    .get(getFlightClassById)
    .delete(deleteFlightClassById)
    .put(validate(FlightClassRequest), updateFlightClass);

  return { router };
};
