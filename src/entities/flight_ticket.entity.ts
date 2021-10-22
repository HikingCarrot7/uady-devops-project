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

  @ManyToOne((type) => User, (user) => user.tickets, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne((type) => Flight, (flight) => flight.tickets, {
    eager: true,
    onDelete: 'CASCADE',
  })
  flight: Flight;

  @ManyToOne((type) => FlightClass, (flightClass) => flightClass.tickets, {
    eager: true,
  })
  flightClass: FlightClass;

  @Column()
  passengers: number;

  flightPrice() {
    return this.passengers * this.flightClass.price;
  }

  constructor(flightTicket?: Partial<FlightTicket>) {
    super();
    Object.assign(this, flightTicket);
  }
}
