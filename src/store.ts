import { Artist } from './artists/entities/artist.entity';
import { User } from './users/entities/user.entity';

const users = new Map<string, User>();
const artists = new Map<string, Artist>();

export const store = {
  users,
  artists,
};
