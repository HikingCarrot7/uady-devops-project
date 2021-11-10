import { Request, Response, Router } from 'express';
import { Loggable } from '../../middleware/loggable.middleware';
import { FlightNotFoundException } from '../../services/flight/flight.exceptions';
import { FlightClassNotFoundException } from '../../services/flight_class/flight_class.exeptions';
import { InmutableFieldException } from '../../services/flight_ticket/flight_ticket.exceptions';
import { FlightTicketService } from '../../services/flight_ticket/flight_ticket.service';
import { UserNotFoundException } from '../../services/user/user.exceptions';
import { serializeError } from '../../utils/serialize_error';
import { validate } from '../../utils/validation';
import { RequestWithUserId } from '../types';
import { FlightTicketNotFoundException } from './flight_ticket.exceptions';
import { FlightTicketRequest } from './flight_ticket.request';
import { UpdateFlightTicketRequest } from './update_flight_ticket.request';

export const FlightTicketRouter = (
  router: Router,
  flightTicketService: FlightTicketService
) => {
  class FlightTicketClass {
    constructor() {
      router
        .route('/flight-ticket')
        .post(validate(FlightTicketRequest), this.createFlightTicket);

      router
        .route('/flight-ticket/:id')
        .get(this.getFlightTicketById)
        .put(validate(UpdateFlightTicketRequest), this.updateFlightTicket)
        .delete(this.deleteFlightTicket);

      router.route('/users/me/flight-tickets').get(this.getMyFlightTickets);
      router.route('/users/:id/flight-tickets').get(this.getUserFlightTickets);
    }

    @Loggable
    async getMyFlightTickets(req: RequestWithUserId, res: Response) {
      const userId = req.userId!!;
      req.params.id = `${userId}`;

      return FlightTicketClass.prototype.getUserFlightTickets(req, res);
    }

    @Loggable
    async getUserFlightTickets(req: Request, res: Response) {
      const userId = parseInt(req.params.id);

      try {
        const flightTickets = await flightTicketService.getUserFlightTickets(
          userId
        );

        return res.status(200).json(flightTickets);
      } catch (error) {
        if (error instanceof UserNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async getFlightTicketById(req: Request, res: Response) {
      const ticketId = parseInt(req.params.id);

      try {
        const ticket = await flightTicketService.getFlightTicketById(ticketId);

        return res.status(200).json(ticket);
      } catch (error) {
        if (error instanceof FlightTicketNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async createFlightTicket(req: RequestWithUserId, res: Response) {
      const userId = req.userId!!;
      const { flightId, flightClassId, ...providedFlightTicket } = req.body;

      try {
        const newFlightTicket = await flightTicketService.createFlightTicket(
          userId,
          flightId,
          flightClassId,
          providedFlightTicket
        );

        return res.status(201).json(newFlightTicket);
      } catch (error) {
        if (
          error instanceof UserNotFoundException ||
          FlightNotFoundException ||
          FlightClassNotFoundException
        ) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async updateFlightTicket(req: RequestWithUserId, res: Response) {
      const ticketId = parseInt(req.params.id);
      const userId = req.userId!!;
      const { flightId, flightClassId, ...providedFlightTicket } = req.body;

      try {
        const updatedTicket = await flightTicketService.updateFlightTicket(
          ticketId,
          userId,
          flightId,
          flightClassId,
          providedFlightTicket
        );

        return res.status(200).json(updatedTicket);
      } catch (error) {
        if (error instanceof InmutableFieldException) {
          return res.status(403).json(serializeError(error.message));
        }

        if (
          error instanceof FlightTicketNotFoundException ||
          FlightClassNotFoundException ||
          FlightNotFoundException
        ) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async deleteFlightTicket(req: Request, res: Response) {
      const ticketId = parseInt(req.params.id);

      try {
        const deletedTicket = await flightTicketService.deleteFlightTicket(
          ticketId
        );

        return res.status(200).json(deletedTicket);
      } catch (error) {
        if (error instanceof FlightTicketNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }
  }

  return new FlightTicketClass();
};
