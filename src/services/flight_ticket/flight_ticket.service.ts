import { Flight } from '../../entities/flight.entity';
import { FlightClass } from '../../entities/flight_class.entity';
import { FlightTicket } from '../../entities/flight_ticket.entity';
import { FlightTicketRepository } from '../../repositories/flight_ticket.repository';
import { FlightTicketNotFoundException } from '../../routes/flight_ticket/flight_ticket.exceptions';
import { FlightService } from '../flight/flight.service';
import { FlightClassService } from '../flight_class/flight_class.service';
import { InvalidPasswordException } from '../user/user.exceptions';
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
    const flightTicket = await this.flightTicketRepo.find({
      where: { id: tickedId },
      loadRelationIds: true,
    });

    if (!flightTicket[0]) {
      throw new FlightTicketNotFoundException(tickedId);
    }

    return flightTicket[0];
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
    userId: number | undefined,
    flightId: number | undefined,
    flightClassId: number | undefined,
    providedFlightTicket: FlightTicket
  ): Promise<FlightTicket> {
    let flightClass: FlightClass | undefined;
    let flight: Flight | undefined;

    if (flightId) {
      flight = await this.flightService.getFlightById(flightId);
    }

    if (flightClassId) {
      flightClass = await this.flightClassService.getFlightClassById(
        flightClassId
      );
    }

    const flightTicket = await this.getFlightTicketById(ticketId);

    if (userId != Number(flightTicket.user)) {
      throw new InmutableFieldException();
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
