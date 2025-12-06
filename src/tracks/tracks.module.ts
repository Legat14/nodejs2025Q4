import { Module } from '@nestjs/common';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';

@Module({
  imports: [FavoritesModule],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
