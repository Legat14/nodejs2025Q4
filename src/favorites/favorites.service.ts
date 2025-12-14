import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesEntity } from './entities/favorites.entity.types';
import { Favorites } from './entities/favorites.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favoritesRepo: Repository<Favorites>,
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepo: Repository<Track>,
  ) {}

  async create() {
    const allFavorites = await this.favoritesRepo.find();

    if (allFavorites.length === 0) {
      const favorites = this.favoritesRepo.create({
        id: uuidv4(),
        track: [],
        album: [],
        artist: [],
      });

      try {
        return await this.favoritesRepo.save(favorites);
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to create the list of favorites',
        );
      }
    }

    return allFavorites[0];
  }

  async findAll() {
    const { artist, album, track } = await this.create();

    const artists = await Promise.all(
      artist.map((id) => this.artistRepo.findOne({ where: { id } })),
    );
    const albums = await Promise.all(
      album.map((id) => this.albumRepo.findOne({ where: { id } })),
    );
    const tracks = await Promise.all(
      track.map((id) =>
        this.trackRepo.findOne({
          where: { id },
          select: ['id', 'name', 'duration', 'artistId', 'albumId'],
        }),
      ),
    );
    return { tracks, albums, artists };
  }

  async add(id: string, entity: FavoritesEntity) {
    switch (entity) {
      case 'artist': {
        const artist = await this.artistRepo.findOne({ where: { id } });
        if (!artist) {
          throw new UnprocessableEntityException(
            `Artist #${id} does not exist`,
          );
        }
        break;
      }
      case 'album': {
        const album = await this.albumRepo.findOne({ where: { id } });
        if (!album) {
          throw new UnprocessableEntityException(`Album #${id} does not exist`);
        }
        break;
      }
      case 'track': {
        const track = await this.trackRepo.findOne({ where: { id } });
        if (!track) {
          throw new UnprocessableEntityException(`Track #${id} does not exist`);
        }
        break;
      }
    }

    const favorites = await this.create();

    const { album, artist, track } = favorites;
    switch (entity) {
      case 'album':
        if (!album.includes(id)) {
          favorites.album.push(id);
        }
        break;
      case 'artist':
        if (!artist.includes(id)) {
          favorites.artist.push(id);
        }
        break;
      case 'track':
        if (!track.includes(id)) {
          favorites.track.push(id);
        }
        break;
      default:
        throw new UnprocessableEntityException(
          `The entity type ${entity} is invalid`,
        );
    }

    try {
      return await this.favoritesRepo.save(favorites);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to add ${entity} #${id} to favorites`,
      );
    }
  }

  async remove(id: string, entity: FavoritesEntity) {
    const favorites = await this.create();

    const { album, artist, track } = favorites;
    switch (entity) {
      case 'album':
        favorites.album = album.filter((albumId) => albumId !== id);
        break;
      case 'artist':
        favorites.artist = artist.filter((artistId) => artistId !== id);
        break;
      case 'track':
        favorites.track = track.filter((trackId) => trackId !== id);
        break;
    }

    try {
      await this.favoritesRepo.save(favorites);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to remove ${entity} #${id} from favorites`,
      );
    }
  }
}
