import { Module } from '@nestjs/common';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';

@Module({
  imports: [TracksModule, FavoritesModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
