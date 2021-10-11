import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { app } from './app';
import { authenticateJWT } from './middleware/auth.middleware';
import { AuthRouter } from './routes/auth/auth.router';
import { FlightRouter } from './routes/flight/flight.router';
import { FlightClassRouter } from './routes/flight_class/flight_class.router';
import { FlightTicketRouter } from './routes/flight_ticket/flight_ticket.router';
import { SiteRouter } from './routes/site/site.router';
import { UserRouter } from './routes/user/user.router';
import { createDefaultServices } from './utils/services.factory';
import { validationError } from './utils/validation';

dotenv.config();

createConnection().then(() => {
  const {
    userService,
    authService,
    flightTicketService,
    siteService,
    flightService,
    flightClassService,
  } = createDefaultServices();

  app.use('/api/v1/', AuthRouter(authService).router);

  app.use(authenticateJWT(userService));

  app.use(
    '/api/v1',
    UserRouter(userService).router,
    FlightTicketRouter(flightTicketService).router,
    SiteRouter(siteService).router,
    FlightRouter(flightService).router,
    FlightClassRouter(flightClassService).router
  );

  app.use(validationError);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Running on port ${process.env.SERVER_PORT}`);
});

export {};
