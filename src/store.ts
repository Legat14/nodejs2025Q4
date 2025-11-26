import { User } from './users/entities/user.entity';

const users = new Map<string, User>();

export const store = {
  users,
};
