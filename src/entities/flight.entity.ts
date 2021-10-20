import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { FlightTicket } from './flight_ticket.entity';
import { Site } from './site.entity';

@Entity({ name: 'flights' })
@Unique(['date', 'hour'])
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

  @ManyToOne((type) => Site, (site) => site.asTakeOffFlights, { eager: true })
  takeOffSite: Site;

  @ManyToOne((type) => Site, (site) => site.asLandingFlights, { eager: true })
  landingSite: Site;

  constructor(flight: Partial<Flight>) {
    super();
    Object.assign(this, flight);
  }
}
