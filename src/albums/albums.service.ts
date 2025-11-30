import { Injectable, NotFoundException } from '@nestjs/common';
import { store } from 'src/store';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksService } from 'src/tracks/tracks.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly tracksService: TracksService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const album = new Album(createAlbumDto);
    store.albums.set(album.id, album);
    return album;
  }

  findAll() {
    return Array.from(store.albums.values());
  }

  findOne(id: string) {
    const album = store.albums.get(id);
    if (!album) {
      throw new NotFoundException(`Album #${id} not found`);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOne(id);
    Object.assign(album, updateAlbumDto);
    return album;
  }

  remove(id: string) {
    this.tracksService.resetAlbumIdToNull(id);
    const isInFavorites = this.favoritesService.isInFavorites(id, 'album');
    if (isInFavorites) {
      this.favoritesService.remove(id, 'album');
    }
    const isDeleted = store.albums.delete(id);
    if (!isDeleted) {
      throw new NotFoundException(`Album #${id} not found`);
    }
  }

  resetArtistIdToNull(artistId: string) {
    const album = this.findAll().find((album) => album.artistId === artistId);
    if (album) {
      album.artistId = null;
    }
  }
}
