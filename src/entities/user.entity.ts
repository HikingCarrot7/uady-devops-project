import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FlightTicket } from './flight_ticket.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany((type) => FlightTicket, (ticket) => ticket.user)
  tickets: FlightTicket[];

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
