import { Album } from './albums/entities/album.entity';
import { Artist } from './artists/entities/artist.entity';
import { Track } from './tracks/entities/track.entity';
import { User } from './users/entities/user.entity';

export type FavoritesCategory = 'tracks' | 'albums' | 'artists';
export type FavoritesEntity = 'track' | 'album' | 'artist';

export const entityCategoryMap: Record<FavoritesEntity, FavoritesCategory> = {
  track: 'tracks',
  album: 'albums',
  artist: 'artists',
};

const users = new Map<string, User>();
const artists = new Map<string, Artist>();
const tracks = new Map<string, Track>();
const albums = new Map<string, Album>();
const favorites = new Map<FavoritesCategory, Set<string>>([
  ['tracks', new Set<string>()],
  ['albums', new Set<string>()],
  ['artists', new Set<string>()],
]);

export const store = {
  users,
  artists,
  tracks,
  albums,
  favorites,
};
