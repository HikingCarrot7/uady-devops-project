import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { FlightTicket } from './flight_ticket.entity';

export enum CabinClass {
  ECONOMY,
  PREMIUM_ECONOMY,
  BUSINESS,
  FIRST_CLASS,
}

@Entity({ name: 'flight_classes' })
@Unique(['cabinClass'])
export class FlightClass extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CabinClass, default: CabinClass.ECONOMY })
  cabinClass: CabinClass;

  @Column()
  price: number;

  @OneToMany((type) => FlightTicket, (ticket) => ticket.flightClass)
  tickets: FlightTicket[];

  constructor(flightClass: Partial<FlightClass>) {
    super();
    Object.assign(this, flightClass);
  }
}
