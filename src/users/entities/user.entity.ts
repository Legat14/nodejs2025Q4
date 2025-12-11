import { Exclude } from 'class-transformer';
import { bigintTransformer } from 'src/bigint-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  login!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column({ default: 1 })
  version!: number;

  @Column({ type: 'bigint', transformer: bigintTransformer })
  createdAt!: number;

  @Column({ type: 'bigint', transformer: bigintTransformer })
  updatedAt!: number;
}
