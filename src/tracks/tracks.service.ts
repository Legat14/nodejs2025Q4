import { Injectable, NotFoundException } from '@nestjs/common';
import { store } from 'src/store';
import { FavoritesService } from 'src/favorites/favorites.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(private readonly favoritesService: FavoritesService) {}

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
    const isInFavorites = this.favoritesService.isInFavorites(id, 'track');
    if (isInFavorites) {
      this.favoritesService.remove(id, 'track');
    }
    const isDeleted = store.tracks.delete(id);
    if (!isDeleted) {
      throw new NotFoundException(`Track #${id} not found`);
    }
  }

  resetArtistIdToNull(artistId: string) {
    const track = this.findAll().find((track) => track.artistId === artistId);
    if (track) {
      track.artistId = null;
    }
  }

  resetAlbumIdToNull(albumId: string) {
    const track = this.findAll().find((track) => track.albumId === albumId);
    if (track) {
      track.albumId = null;
    }
  }
}
