import { Module } from '@nestjs/common';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';

@Module({
  imports: [FavoritesModule],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
