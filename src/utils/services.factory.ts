import { getCustomRepository } from 'typeorm';
import { FlightRepository } from '../repositories/flight.repository';
import { FlightClassRepository } from '../repositories/flight_class.repository';
import { FlightTicketRepository } from '../repositories/flight_ticket.repository';
import { SiteRepository } from '../repositories/site.repository';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth/auth.service';
import { FlightService } from '../services/flight/flight.service';
import { FlightClassService } from '../services/flight_class/flight_class.service';
import { FlightTicketService } from '../services/flight_ticket/flight_ticket.service';
import { SiteService } from '../services/site/site.service';
import { UserService } from '../services/user/user.service';

export const createDefaultServices = () => {
  const userService = new UserService(getCustomRepository(UserRepository));

  const authService = new AuthService(userService);

  const flightTicketService = new FlightTicketService(
    getCustomRepository(FlightTicketRepository)
  );

  const siteService = new SiteService(getCustomRepository(SiteRepository));

  const flightService = new FlightService(
    getCustomRepository(FlightRepository)
  );

  const flightClassService = new FlightClassService(
    getCustomRepository(FlightClassRepository)
  );

  return {
    userService,
    authService,
    flightTicketService,
    siteService,
    flightService,
    flightClassService,
  };
};
