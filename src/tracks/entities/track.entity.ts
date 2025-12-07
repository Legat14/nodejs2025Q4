import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  artistId!: string | null;

  @Column({ nullable: true })
  albumId!: string | null;

  @Column({ type: 'int' })
  duration!: number;
}
