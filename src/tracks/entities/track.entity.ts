import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from '../dto/create-track.dto';

export class Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(dto: CreateTrackDto) {
    this.id = uuidv4();
    this.name = dto.name;
    this.artistId = dto.artistId;
    this.albumId = dto.albumId;
    this.duration = dto.duration;
  }
}
