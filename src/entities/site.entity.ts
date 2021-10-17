import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Country } from './country.entity';
import { Flight } from './flight.entity';

@Entity({ name: 'sities' })
@Unique(['city', 'state'])
export class Site extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Country, (country) => country.sites, { eager: true })
  country: Country;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50 })
  state: string;

  @OneToMany((type) => Flight, (flight) => flight.takeOffSite)
  asTakeOffFlights: Flight[];

  @OneToMany((type) => Flight, (flight) => flight.landingSite)
  asLandingFlights: Flight[];

  constructor(site: Partial<Site>) {
    super();
    Object.assign(this, site);
  }
}
