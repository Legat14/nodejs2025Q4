import { Injectable, NotFoundException } from '@nestjs/common';
import { store } from 'src/store';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  create(createTrackDto: CreateTrackDto) {
    const track = new Track(createTrackDto);
    store.tracks.set(track.id, track);
    return track;
  }

  findAll() {
    return Array.from(store.tracks.values());
  }

  findOne(id: string) {
    const track = store.tracks.get(id);

    if (!track) {
      throw new NotFoundException(`Track #${id} not found`);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);
    Object.assign(track, updateTrackDto);
    return track;
  }

  remove(id: string) {
    const isDeleted = store.tracks.delete(id);

    if (!isDeleted) {
      throw new NotFoundException(`Track #${id} not found`);
    }
  }
}
