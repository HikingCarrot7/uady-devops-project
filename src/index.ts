import dotenv from "dotenv";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { app } from "./app";
import { UserRouter } from "./routes/user/user.router";
import { FlightRouter } from "./routes/flight/flight.router";
import { validationError } from "./utils/validation";

dotenv.config();

createConnection().then(() => {
  app.use("/api/v1", UserRouter().router, FlightRouter().router);

  app.use(validationError);
});

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Running on port ${process.env.SERVER_PORT}`)
);

export {};
