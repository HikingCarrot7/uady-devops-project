import { FlightTicket } from '../../entities/flight_ticket.entity';
import { FlightTicketRepository } from '../../repositories/flight_ticket.repository';
import { invalidIdMsg, isNumericId } from '../../utils/validateId';

export class FlightTicketService {
  constructor(private flightTicketRepo: FlightTicketRepository) {}

  getUserFlightTickets = async (userId: number | string) => {
    if (!isNumericId(userId)) {
      return Promise.reject(invalidIdMsg(userId));
    }

    return await this.flightTicketRepo.find({
      where: { user: { id: userId } },
    });
  };

  getFlightTicketById = async (tickedId: number | string) => {
    if (!isNumericId(tickedId)) {
      return Promise.reject(invalidIdMsg(tickedId));
    }

    return await this.flightTicketRepo.findOne({ id: tickedId });
  };

  createFlightTicket = async (
    userId: number,
    flightId: number,
    flightClassId: number,
    passengers: number
  ) => {
    try {
      const newTicket = await this.flightTicketRepo.save({
        user: { id: userId },
        flight: { id: flightId },
        flightClass: { id: flightClassId },
        passengers,
      });

      return await this.flightTicketRepo.findOne(newTicket.id);
    } catch (error) {
      return null;
    }
  };

  updateFlightTicket = async (
    ticketId: number | string,
    newFlightTicket: FlightTicket
  ) => {
    if (!isNumericId(ticketId)) {
      return Promise.reject(invalidIdMsg(ticketId));
    }

    const flightTicket = await this.flightTicketRepo.findOne(ticketId);

    if (!flightTicket) {
      return null;
    }

    // Por el momento...
    flightTicket.passengers = newFlightTicket.passengers;

    return await this.flightTicketRepo.save(flightTicket);
  };

  deleteFlightTicket = async (ticketId: number | string) => {
    if (!isNumericId(ticketId)) {
      return Promise.reject(invalidIdMsg(ticketId));
    }

    const flightTicket = await this.flightTicketRepo.findOne(ticketId);

    if (!flightTicket) {
      return null;
    }

    await this.flightTicketRepo.delete(ticketId);

    return flightTicket;
  };
}
