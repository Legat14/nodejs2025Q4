import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: 1 })
  version: number;

  @CreateDateColumn({ type: 'bigint' })
  createdAt: number;

  @UpdateDateColumn({ type: 'bigint' })
  updatedAt: number;
}
