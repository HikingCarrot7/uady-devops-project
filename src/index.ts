import dotenv from 'dotenv';
import { Router } from 'express';
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';
import { app } from './app';
import { JWTAuthenticator } from './middleware/auth.middleware';
import { TypeORMLogger } from './middleware/typeorm.logger.middleware';
import { validateParamId } from './middleware/validate_id_format.middleware';
import { AuthRouter } from './routes/auth/auth.router';
import { FlightRouter } from './routes/flight/flight.router';
import { FlightClassRouter } from './routes/flight_class/flight_class.router';
import { FlightTicketRouter } from './routes/flight_ticket/flight_ticket.router';
import { SiteRouter } from './routes/site/site.router';
import { UserRouter } from './routes/user/user.router';
import { createDefaultServices } from './utils/services.factory';
import { validationError } from './utils/validation';

dotenv.config();

getConnectionOptions().then((connectionOptions) => {
  return createConnection(
    Object.assign(connectionOptions, { logger: new TypeORMLogger() })
  ).then(() => {
    const {
      authService,
      userService,
      siteService,
      flightClassService,
      flightService,
      flightTicketService,
    } = createDefaultServices();

    const publicRouter = Router();
    const privateRouter = Router();

    privateRouter.param('id', validateParamId);

    AuthRouter(publicRouter, authService);

    app.use('/api/v1/', publicRouter);
    app.use(JWTAuthenticator(userService).authenticateJWT);

    UserRouter(privateRouter, userService);
    SiteRouter(privateRouter, siteService);
    FlightClassRouter(privateRouter, flightClassService);
    FlightRouter(privateRouter, flightService);
    FlightTicketRouter(privateRouter, flightTicketService);

    app.use('/api/v1', privateRouter);
    app.use(validationError);
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(process.env.DB_HOST);
  console.log(`Running on port ${process.env.SERVER_PORT}`);
});
