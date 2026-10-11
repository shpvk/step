import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Role } from '../../role/entities/role.entity.js';
import { City } from './city.entity.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  email: string;

  @Column({ nullable: false, length: 100 })
  password_hash: string;

  @Column({ nullable: false, length: 50 })
  fullname: string;

  @Column({ default: false })
  is_block: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Relation<Role>;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string | null;

  @Column({ type: 'int', nullable: true })
  city_id: number | null;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: Relation<City>;
}
