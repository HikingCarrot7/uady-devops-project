import { EntityRepository, Repository } from "typeorm";
import { Flight } from "../entities/flight.entity";

@EntityRepository(Flight)
export class FlightRepository extends Repository<Flight> {}
