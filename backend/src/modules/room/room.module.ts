import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomAmenitiesService } from '../room-amenities/room-amenities.service';
import { Room } from './entities/room.entity';
import { Amenity } from '../amenities/entities/amenity.entity';
import { RoomAmenity } from '../room-amenities/entities/room-amenity.entity';
import { AvailabilityModule } from '../availability/availability.module';
import { AppointmentModule } from '../appointments/appointment.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Amenity, RoomAmenity]),
    AvailabilityModule,
    AppointmentModule,
    UserModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomAmenitiesService],
})
export class RoomModule {}
