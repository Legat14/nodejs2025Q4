import { Injectable, NotFoundException } from '@nestjs/common';
import { store } from 'src/store';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  create(createArtistDto: CreateArtistDto) {
    const artist = new Artist(createArtistDto);
    store.artists.set(artist.id, artist);
    return artist;
  }

  findAll() {
    return Array.from(store.artists.values());
  }

  findOne(id: string) {
    const artist = store.artists.get(id);
    if (!artist) {
      throw new NotFoundException(`Artist #${id} not found`);
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.findOne(id);
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  remove(id: string) {
    const isDeleted = store.artists.delete(id);

    if (!isDeleted) {
      throw new NotFoundException(`Artist #${id} not found`);
    }
  }
}
