import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FlightTicket } from './flight_ticket.entity';
import { Site } from './site.entity';

@Entity({ name: 'flights' })
export class Flight extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  hour: string;

  @Column()
  estimatedHours: number;

  @OneToMany((type) => FlightTicket, (flightTicket) => flightTicket.flight)
  tickets: FlightTicket[];

  @ManyToOne((type) => Site, (site) => site.asTakeOffFlights)
  takeOffSite: Site;

  @ManyToOne((type) => Site, (site) => site.asLandingFlights)
  landingSite: Site;
}
