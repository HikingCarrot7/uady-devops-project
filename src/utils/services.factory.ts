import { getCustomRepository } from 'typeorm';
import { CountryRepository } from '../repositories/country.repository';
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
  const userService = createDefaultUserService();
  const authService = createDefaultAuthService(userService);
  const siteService = createDefaultSiteService();
  const flightClassService = createDefaultFlightClassService();
  const flightService = createDefaultFlightService(siteService);
  const flightTicketService = createDefaultFlightTicketService(
    userService,
    flightService,
    flightClassService
  );

  return {
    userService,
    authService,
    siteService,
    flightClassService,
    flightService,
    flightTicketService,
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

export const createDefaultFlightClassService = () => {
  return new FlightClassService(getCustomRepository(FlightClassRepository));
};

export const createDefaultFlightTicketService = (
  userService: UserService,
  flightService: FlightService,
  flightClassService: FlightClassService
) => {
  return new FlightTicketService(
    getCustomRepository(FlightTicketRepository),
    userService,
    flightService,
    flightClassService
  );
};

export const createDefaultFlightService = (siteService: SiteService) => {
  return new FlightService(getCustomRepository(FlightRepository), siteService);
};
