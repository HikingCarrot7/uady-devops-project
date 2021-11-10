import { Flight } from '../../entities/flight.entity';
import { FlightClass } from '../../entities/flight_class.entity';
import { FlightTicket } from '../../entities/flight_ticket.entity';
import { FlightTicketRepository } from '../../repositories/flight_ticket.repository';
import { FlightTicketNotFoundException } from '../../routes/flight_ticket/flight_ticket.exceptions';
import { FlightService } from '../flight/flight.service';
import { FlightClassService } from '../flight_class/flight_class.service';
import { UserService } from '../user/user.service';
import { InmutableFieldException } from './flight_ticket.exceptions';

export class FlightTicketService {
  constructor(
    private flightTicketRepo: FlightTicketRepository,
    private userService: UserService,
    private flightService: FlightService,
    private flightClassService: FlightClassService
  ) {}

  async getUserFlightTickets(userId: number): Promise<FlightTicket[]> {
    await this.userService.getUserById(userId);

    return await this.flightTicketRepo.find({
      where: { user: { id: userId } },
    });
  }

  async getFlightTicketById(tickedId: number): Promise<FlightTicket> {
    const flightTicket = await this.flightTicketRepo.findOne({
      where: { id: tickedId },
      loadRelationIds: true,
    });

    if (!flightTicket) {
      throw new FlightTicketNotFoundException(tickedId);
    }

    return flightTicket;
  }

  async createFlightTicket(
    userId: number,
    flightId: number,
    flightClassId: number,
    providedFlightTicket: FlightTicket
  ): Promise<FlightTicket> {
    const user = await this.userService.getUserById(userId);
    const flight = await this.flightService.getFlightById(flightId);
    const flightClass = await this.flightClassService.getFlightClassById(
      flightClassId
    );

    const newTicket = await this.flightTicketRepo.save({
      ...providedFlightTicket,
      user,
      flight,
      flightClass,
    });

    return await this.getFlightTicketById(newTicket.id);
  }

  async updateFlightTicket(
    ticketId: number,
    userId: UndefinedOr<number>,
    flightId: UndefinedOr<number>,
    flightClassId: UndefinedOr<number>,
    providedFlightTicket: FlightTicket
  ): Promise<FlightTicket> {
    let flightClass: UndefinedOr<FlightClass>;
    let flight: UndefinedOr<Flight>;

    if (flightId) {
      flight = await this.flightService.getFlightById(flightId);
    }

    if (flightClassId) {
      flightClass = await this.flightClassService.getFlightClassById(
        flightClassId
      );
    }

    const flightTicket = await this.getFlightTicketById(ticketId);

    // Para que un usuario no pueda cambiar el ID del vuelo de un ticket que no le pertenece...
    if (userId !== Number(flightTicket.user)) {
      throw new InmutableFieldException();
    }

    if (flight) {
      flightTicket.flight = flight;
    }

    if (flightClass) {
      flightTicket.flightClass = flightClass;
    }

    const updatedFlightTicket = new FlightTicket({
      ...flightTicket,
      ...providedFlightTicket,
    });

    await this.flightTicketRepo.save(updatedFlightTicket);

    return await this.getFlightTicketById(ticketId);
  }

  async deleteFlightTicket(ticketId: number): Promise<FlightTicket> {
    const flightTicket = await this.getFlightTicketById(ticketId);

    await this.flightTicketRepo.delete(ticketId);

    return flightTicket;
  }
}
