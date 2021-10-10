import { EntityRepository, Repository } from 'typeorm';
import { FlightTicket } from './../entities/flight_ticket.entity';

@EntityRepository(FlightTicket)
export class FlightTicketRepository extends Repository<FlightTicket> {}
