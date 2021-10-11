import express, { Request, Response } from 'express';
import { FlightTicket } from '../../entities/flight_ticket.entity';
import { FlightTicketService } from '../../services/flight_ticket/flight_ticket.service';
import { validate } from '../../utils/validation';
import { FlightTicketRequest } from './flight_ticket.request';

export const FlightTicketRouter = (
  flightTicketService: FlightTicketService
) => {
  const getUserFlightTickets = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      const userFlightTickets = await flightTicketService.getUserFlightTickets(
        userId
      );

      if (!userFlightTickets) {
        return res
          .status(404)
          .json({ error: `No existe el usuario con id: ${userId}` });
      }

      return res.status(200).json(userFlightTickets);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  const getFlightTicketById = async (req: Request, res: Response) => {
    const ticketId = req.params.id;

    try {
      const ticket = await flightTicketService.getFlightTicketById(ticketId);

      if (!ticket) {
        return res
          .status(404)
          .json({ error: `No existe el ticket con el ID ${ticketId}` });
      }

      return res.status(200).json(ticket);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  const createFlightTicket = async (req: Request, res: Response) => {
    const flightTicketRequest = req.body as FlightTicketRequest;
    const { userId, flightId, flightClassId, passengers } = flightTicketRequest;

    try {
      const newFlightTicket = await flightTicketService.createFlightTicket(
        userId,
        flightId,
        flightClassId,
        passengers
      );

      if (!newFlightTicket) {
        return res
          .status(404)
          .json(`Revisa el id del usuario, el vuelo o la clase de vuelo`);
      }

      return res.status(201).json({ ...newFlightTicket });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  const updateFlightTicket = async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const flightTicketRequest = req.body;

    try {
      const updatedTicket = await flightTicketService.updateFlightTicket(
        ticketId,
        new FlightTicket(flightTicketRequest)
      );

      if (!updatedTicket) {
        return res
          .status(404)
          .json({ error: `No existe el usuario con el id: ${ticketId}` });
      }

      return res.status(200).json({ ...updatedTicket });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  const deleteFlightTicket = async (req: Request, res: Response) => {
    const ticketId = req.params.id;

    try {
      const deletedTicket = await flightTicketService.deleteFlightTicket(
        ticketId
      );

      if (!deletedTicket) {
        return res
          .status(404)
          .json({ error: `No existe el ticket con el Id: ${ticketId}` });
      }

      return res.status(200).json({ ...deletedTicket });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  const router = express.Router();

  router
    .route('/flight-ticket')
    .post(validate(FlightTicketRequest), createFlightTicket);

  router
    .route('/flight-ticket/:id')
    .get(getFlightTicketById)
    .put(validate(FlightTicketRequest), updateFlightTicket)
    .delete(deleteFlightTicket);

  router.route('/users/:id/flight-tickets').get(getUserFlightTickets);

  return {
    router,
    routes: {
      getUserFlightTickets,
      getFlightTicketById,
      createFlightTicket,
      updateFlightTicket,
      deleteFlightTicket,
    },
  };
};
