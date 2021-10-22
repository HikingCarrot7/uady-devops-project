import { FlightClass } from '../../entities/flight_class.entity';
import { FlightTicket } from '../../entities/flight_ticket.entity';
import { FlightTicketRepository } from '../../repositories/flight_ticket.repository';
import { FlightTicketNotFoundException } from '../../routes/flight_ticket/flight_ticket.exceptions';
import { FlightService } from '../flight/flight.service';
import { FlightClassService } from '../flight_class/flight_class.service';
import { UserService } from '../user/user.service';

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
    const flightTicket = await this.flightTicketRepo.findOne({ id: tickedId });

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
    flightClassId: number | undefined,
    providedFlightTicket: FlightTicket
  ): Promise<FlightTicket> {
    let flightClass: FlightClass | undefined;

    if (flightClassId) {
      flightClass = await this.flightClassService.getFlightClassById(
        flightClassId
      );
    }

    const flightTicket = await this.getFlightTicketById(ticketId);

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
