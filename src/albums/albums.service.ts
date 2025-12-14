import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    const album = await this.albumRepo.create({
      id: uuidv4(),
      name,
      year,
      artistId: artistId || null,
    });

    try {
      return await this.albumRepo.save(album);
    } catch (error) {
      throw new NotFoundException('Failed to create new album');
    }
  }

  async findAll() {
    return await this.albumRepo.find();
  }

  async findOne(id: string) {
    const album = await this.albumRepo.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album #${id} not found`);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id);
    Object.assign(album, updateAlbumDto);
    await this.albumRepo.save(album);
    return album;
  }

  async remove(id: string) {
    const result = await this.albumRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album #${id} not found`);
    }
  }
}
