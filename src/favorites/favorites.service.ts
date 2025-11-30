import { entityCategoryMap, FavoritesEntity, store } from 'src/store';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class FavoritesService {
  findAll() {
    const favoriteTracks = store.favorites.get('tracks');
    const favoriteAlbums = store.favorites.get('albums');
    const favoriteArtists = store.favorites.get('artists');

    const tracks = Array.from(favoriteTracks, (trackId) =>
      store.tracks.get(trackId),
    );
    const albums = Array.from(favoriteAlbums, (albumId) =>
      store.albums.get(albumId),
    );
    const artists = Array.from(favoriteArtists, (artistId) =>
      store.artists.get(artistId),
    );

    return { tracks, albums, artists };
  }

  add(id: string, entity: FavoritesEntity) {
    const category = entityCategoryMap[entity];
    const isExists = store[category].has(id);
    if (!isExists) {
      throw new UnprocessableEntityException(
        `The ${entity} with id ${id} not exists`,
      );
    }
    store.favorites.get(category).add(id);
    return `The ${entity} #${id} was added to favorites`;
  }

  remove(id: string, entity: FavoritesEntity) {
    const category = entityCategoryMap[entity];
    const isDeleted = store.favorites.get(category).delete(id);
    if (!isDeleted) {
      throw new NotFoundException(`Favorite ${entity} with id ${id} not found`);
    }
  }
}
