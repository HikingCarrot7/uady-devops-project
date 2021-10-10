import { EntityRepository, Repository } from 'typeorm';
import { FlightClass } from '../entities/flight_class.entity';

@EntityRepository(FlightClass)
export class FlightClassRepository extends Repository<FlightClass> {}
