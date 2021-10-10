import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flight } from './flight.entity';

@Entity({ name: 'sities' })
export class Site extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  code: number;

  @OneToMany((type) => Flight, (flight) => flight.takeOffSite)
  asTakeOffFlights: Flight[];

  @OneToMany((type) => Flight, (flight) => flight.landingSite)
  asLandingFlights: Flight[];

  constructor(site: Partial<Site>) {
    super();
    Object.assign(this, site);
  }
}
