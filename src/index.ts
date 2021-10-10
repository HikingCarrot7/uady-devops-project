import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { app } from './app';
import { FlightTicketRouter } from './routes/flight_ticket/flight_ticket.router';
import { UserRouter } from './routes/user/user.router';
import { validationError } from './utils/validation';

dotenv.config();

createConnection().then(() => {
  app.use('/api/v1', UserRouter().router, FlightTicketRouter().router);

  app.use(validationError);
});

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Running on port ${process.env.SERVER_PORT}`)
);

export {};
