import { FavoritesEntity } from 'src/store';
import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post(':entity/:id')
  add(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entity') entity: FavoritesEntity,
  ) {
    return this.favoritesService.add(id, entity);
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entity') entity: FavoritesEntity,
  ) {
    return this.favoritesService.remove(id, entity);
  }
}
