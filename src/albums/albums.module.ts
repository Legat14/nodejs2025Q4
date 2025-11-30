import { Module } from '@nestjs/common';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';

@Module({
  imports: [FavoritesModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
