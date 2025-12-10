import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistsRepo: Repository<Artist>,
    private readonly favoritesService: FavoritesService,
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const artist = this.artistsRepo.create({
      id: uuidv4(),
      ...createArtistDto,
    });

    try {
      return await this.artistsRepo.save(artist);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create new artist');
    }
  }

  async findAll() {
    return await this.artistsRepo.find();
  }

  async findOne(id: string) {
    const artist = await this.artistsRepo.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist #${id} not found`);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);
    Object.assign(artist, updateArtistDto);
    await this.artistsRepo.save(artist);
    return artist;
  }

  async remove(id: string) {
    const isInFavorites = this.favoritesService.isInFavorites(id, 'artist');
    if (isInFavorites) {
      this.favoritesService.remove(id, 'artist');
    }
    const result = await this.artistsRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Artist #${id} not found`);
    }
  }
}
