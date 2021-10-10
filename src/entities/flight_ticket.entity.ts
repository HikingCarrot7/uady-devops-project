import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flight } from './flight.entity';
import { FlightClass } from './flight_class.entity';
import { User } from './user.entity';

@Entity({ name: 'flight_tickets' })
export class FlightTicket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.tickets)
  user: User;

  @ManyToOne((type) => Flight, (flight) => flight.tickets)
  flight: Flight;

  @ManyToOne((type) => FlightClass, (flightClass) => flightClass.tickets)
  flightClass: FlightClass;

  @Column()
  passengers: number;

  flightPrice() {
    return this.passengers * this.flightClass.price;
  }
}
