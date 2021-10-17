import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Site } from './site.entity';

@Unique(['name', 'phoneCode'])
@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'phone_code' })
  phoneCode: number;

  @OneToMany((type) => Site, (site) => site.country)
  sites: Site[];
}
