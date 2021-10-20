import { getCustomRepository } from 'typeorm';
import { CountryRepository } from '../repositories/country.repository';
import { FlightRepository } from '../repositories/flight.repository';
import { FlightTicketRepository } from '../repositories/flight_ticket.repository';
import { SiteRepository } from '../repositories/site.repository';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth/auth.service';
import { FlightService } from '../services/flight/flight.service';
import { FlightTicketService } from '../services/flight_ticket/flight_ticket.service';
import { SiteService } from '../services/site/site.service';
import { UserService } from '../services/user/user.service';

export const createDefaultServices = () => {
  const userService = createDefaultUserService();
  const authService = createDefaultAuthService(userService);
  const siteService = createDefaultSiteService();
  const flightService = createDefaultFlightService(siteService);
  const flightTicketService = createDefaultFlightTicketService();

  return {
    userService,
    authService,
    flightTicketService,
    siteService,
    flightService,
  };
};

export const createDefaultAuthService = (userService: UserService) => {
  return new AuthService(userService);
};

export const createDefaultUserService = () => {
  return new UserService(getCustomRepository(UserRepository));
};

export const createDefaultSiteService = () => {
  return new SiteService(
    getCustomRepository(SiteRepository),
    getCustomRepository(CountryRepository)
  );
};

export const createDefaultFlightTicketService = () => {
  return new FlightTicketService(getCustomRepository(FlightTicketRepository));
};

export const createDefaultFlightService = (siteService: SiteService) => {
  return new FlightService(getCustomRepository(FlightRepository), siteService);
};
