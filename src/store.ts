import { Artist } from './artists/entities/artist.entity';
import { Track } from './tracks/entities/track.entity';
import { User } from './users/entities/user.entity';

const users = new Map<string, User>();
const artists = new Map<string, Artist>();
const tracks = new Map<string, Track>();

export const store = {
  users,
  artists,
  tracks,
};
