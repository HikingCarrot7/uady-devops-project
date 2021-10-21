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

  @Column({ length: 15 })
  date: string;

  @Column({ length: 10 })
  hour: string;

  @Column()
  estimatedHours: number;

  @OneToMany((type) => FlightTicket, (flightTicket) => flightTicket.flight)
  tickets: FlightTicket[];

  @ManyToOne((type) => Site, (site) => site.asTakeOffFlights, {
    eager: true,
    onDelete: 'CASCADE',
  })
  takeOffSite: Site;

  @ManyToOne((type) => Site, (site) => site.asLandingFlights, {
    eager: true,
    onDelete: 'CASCADE',
  })
  landingSite: Site;

  constructor(flight: Partial<Flight>) {
    super();
    Object.assign(this, flight);
  }
}
