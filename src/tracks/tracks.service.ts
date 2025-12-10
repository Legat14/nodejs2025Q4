import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoritesService } from 'src/favorites/favorites.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    private readonly favoritesService: FavoritesService,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const { name, artistId, albumId, duration } = createTrackDto;
    const track: Track = this.trackRepository.create({
      id: uuidv4(),
      name,
      artistId: artistId || null,
      albumId: albumId || null,
      duration,
    });

    try {
      return this.trackRepository.save(track);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create new user');
    }
  }

  async findAll() {
    return this.trackRepository.find();
  }

  async findOne(id: string) {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException(`Track #${id} not found`);
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);
    Object.assign(track, updateTrackDto);
    return this.trackRepository.save(track);
  }

  async remove(id: string) {
    const isInFavorites = this.favoritesService.isInFavorites(id, 'track');
    if (isInFavorites) {
      this.favoritesService.remove(id, 'track');
    }
    const result = await this.trackRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Track #${id} not found`);
    }
  }
}
