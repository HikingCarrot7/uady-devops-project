import { FlightTicket } from '../../entities/flight_ticket.entity';
import { FlightTicketRepository } from '../../repositories/flight_ticket.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';

export const FlightTicketService = (
  flightTicketRepository: FlightTicketRepository
) => {
  const getUserFlightTickets = async (userId: number | string) => {
    if (!isValidId(userId)) {
      return Promise.reject(invalidIdMsg(userId));
    }

    return await flightTicketRepository.find({
      where: { user: { id: userId } },
    });
  };

  const getFlightTicketById = async (tickedId: number | string) => {
    if (!isValidId(tickedId)) {
      return Promise.reject(invalidIdMsg(tickedId));
    }

    return await flightTicketRepository.findOne({ id: tickedId });
  };

  const createFlightTicket = async (
    userId: number,
    flightId: number,
    flightClassId: number,
    passengers: number
  ) => {
    try {
      return await flightTicketRepository.save({
        user: { id: userId },
        flight: { id: flightId },
        flightClass: { id: flightClassId },
        passengers,
      });
    } catch (error) {
      return null;
    }
  };

  const updateFlightTicket = async (
    ticketId: number | string,
    newFlightTicket: FlightTicket
  ) => {
    if (!isValidId(ticketId)) {
      return Promise.reject(invalidIdMsg(ticketId));
    }

    const flightTicket = await flightTicketRepository.findOne(ticketId);

    if (!flightTicket) {
      return null;
    }

    // Por el momento...
    flightTicket.passengers = newFlightTicket.passengers;

    return await flightTicketRepository.save(flightTicket);
  };

  const deleteFlightTicket = async (ticketId: number | string) => {
    if (!isValidId(ticketId)) {
      return Promise.reject(invalidIdMsg(ticketId));
    }

    const flightTicket = await flightTicketRepository.findOne(ticketId);

    if (!flightTicket) {
      return null;
    }

    await flightTicketRepository.delete(ticketId);

    return flightTicket;
  };

  return {
    getUserFlightTickets,
    getFlightTicketById,
    createFlightTicket,
    updateFlightTicket,
    deleteFlightTicket,
  };
};
