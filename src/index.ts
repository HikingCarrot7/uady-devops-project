import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { app } from './app';
import { UserRouter } from './routes/user/user.router';
import { SiteRouter } from './routes/site/site.router';
import { FlightRouter } from './routes/flight/flight.router';
import { FlightClassRouter } from './routes/flight_class/flight_class.router';
import { validationError } from './utils/validation';

dotenv.config();

createConnection().then(() => {
  app.use(
    '/api/v1',
    UserRouter().router,
    SiteRouter().router,
    FlightRouter().router,
    FlightClassRouter().router
  );

  app.use(validationError);
});

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Running on port ${process.env.SERVER_PORT}`)
);

export {};
