import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { Favorite } from './entities/favorite.entity';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Room, User])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
