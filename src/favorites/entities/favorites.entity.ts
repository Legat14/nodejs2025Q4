import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { array: true, default: [] })
  track: string[];

  @Column('uuid', { array: true, default: [] })
  album: string[];

  @Column('uuid', { array: true, default: [] })
  artist: string[];
}
