import { Module } from '@nestjs/common';
import { RoomAmenitiesService } from './room-amenities.service';
import { RoomAmenitiesController } from './room-amenities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomAmenity } from './entities/room-amenity.entity';
import { Room } from '../room/entities/room.entity';
import { Amenity } from '../amenities/entities/amenity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomAmenity, Room, Amenity])],
  controllers: [RoomAmenitiesController],
  providers: [RoomAmenitiesService],
})
export class RoomAmenitiesModule {}
