import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomAmenitiesService } from './room-amenities.service';
import { CreateRoomAmenityDto } from './dto/create-room-amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room-amenity.dto';

@Controller('room-amenities')
export class RoomAmenitiesController {
  constructor(private readonly roomAmenitiesService: RoomAmenitiesService) {}

  @Post()
  create(@Body() createRoomAmenityDto: CreateRoomAmenityDto) {
    return this.roomAmenitiesService.create(createRoomAmenityDto);
  }

  @Get()
  findAll() {
    return this.roomAmenitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomAmenitiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomAmenityDto: UpdateRoomAmenityDto,
  ) {
    return this.roomAmenitiesService.update(+id, updateRoomAmenityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomAmenitiesService.remove(+id);
  }
}
