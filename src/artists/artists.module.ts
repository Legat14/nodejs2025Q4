import { Module } from '@nestjs/common';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';

@Module({
  imports: [FavoritesModule, TracksModule, AlbumsModule],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
