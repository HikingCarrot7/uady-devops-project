import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection, getCustomRepository } from 'typeorm';
import { app } from './app';
import { FlightRepository } from './repositories/flight.repository';
import { FlightClassRepository } from './repositories/flight_class.repository';
import { FlightTicketRepository } from './repositories/flight_ticket.repository';
import { SiteRepository } from './repositories/site.repository';
import { UserRepository } from './repositories/user.repository';
import { FlightRouter } from './routes/flight/flight.router';
import { FlightClassRouter } from './routes/flight_class/flight_class.router';
import { FlightTicketRouter } from './routes/flight_ticket/flight_ticket.router';
import { SiteRouter } from './routes/site/site.router';
import { UserRouter } from './routes/user/user.router';
import { FlightService } from './services/flight/flight.service';
import { FlightClassService } from './services/flight_class/flight_class.service';
import { FlightTicketService } from './services/flight_ticket/flight_ticket.service';
import { SiteService } from './services/site/site.service';
import { UserService } from './services/user/user.service';
import { validationError } from './utils/validation';

dotenv.config();

createConnection().then(() => {
  app.use(
    '/api/v1',

    UserRouter(new UserService(getCustomRepository(UserRepository))).router,

    FlightTicketRouter(
      new FlightTicketService(getCustomRepository(FlightTicketRepository))
    ).router,

    SiteRouter(new SiteService(getCustomRepository(SiteRepository))).router,

    FlightRouter(new FlightService(getCustomRepository(FlightRepository)))
      .router,

    FlightClassRouter(
      new FlightClassService(getCustomRepository(FlightClassRepository))
    ).router
  );

  app.use(validationError);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Running on port ${process.env.SERVER_PORT}`);
});

export {};
