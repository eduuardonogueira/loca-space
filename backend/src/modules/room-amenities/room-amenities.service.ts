import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoomAmenityDto } from './dto/create-room-amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room-amenity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomAmenity } from './entities/room-amenity.entity';
import { Room } from '../room/entities/room.entity';
import { Amenity } from '../amenities/entities/amenity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomAmenitiesService {
  constructor(
    @InjectRepository(RoomAmenity)
    private roomAmenityRepository: Repository<RoomAmenity>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Amenity)
    private amenityRepository: Repository<Amenity>,
  ) {}

  async create(createRoomAmenityDto: CreateRoomAmenityDto) {
    const room = await this.roomRepository.findOne({
      where: { id: createRoomAmenityDto.roomId },
    });
    if (!room) throw new HttpException('Room not found', 404);
    const amenity = await this.amenityRepository.findOne({
      where: { id: createRoomAmenityDto.amenityId },
    });
    if (!amenity) throw new HttpException('Amenity not found', 404);
    const roomAmenity = this.roomAmenityRepository.create({
      room,
      amenity,
    });
    return await this.roomAmenityRepository.save(roomAmenity);
  }

  async findAll() {
    return await this.roomAmenityRepository.find({
      relations: ['room', 'amenity'],
    });
  }

  async findOne(id: number) {
    const roomAmenity = await this.roomAmenityRepository.findOne({
      where: { id },
      relations: ['room', 'amenity'],
    });
    if (!roomAmenity) {
      throw new HttpException(`RoomAmenity with ID ${id} not found`, 404);
    }
    return roomAmenity;
  }

  async findByRoomAndAmenityId(roomId: number, amenityId: number) {
    const findedRoomAmenity = await this.roomAmenityRepository.findOne({
      where: { room: { id: roomId }, amenity: { id: amenityId } },
    });
    if (!findedRoomAmenity) {
      throw new HttpException(
        `RoomAmenity with roomID ${roomId} and amenityID ${amenityId} not found`,
        404,
      );
    }
    return findedRoomAmenity;
  }

  async update(id: number, updateRoomAmenityDto: UpdateRoomAmenityDto) {
    const roomAmenity = await this.roomAmenityRepository.findOne({
      where: { id },
    });
    if (!roomAmenity) {
      throw new HttpException('RoomAmenity not found', 404);
    }
    const room = await this.roomRepository.findOne({
      where: { id: updateRoomAmenityDto.roomId },
    });
    if (!room) throw new HttpException('Room not found', 404);
    const amenity = await this.amenityRepository.findOne({
      where: { id: updateRoomAmenityDto.amenityId },
    });
    if (!amenity) throw new HttpException('Amenity not found', 404);
    roomAmenity.room = room;
    roomAmenity.amenity = amenity;
    return this.roomAmenityRepository.save(roomAmenity);
  }

  async remove(id: number) {
    const roomAmenity = await this.roomAmenityRepository.findOne({
      where: { id },
    });
    if (!roomAmenity) {
      throw new HttpException(`RoomAmenity with ID ${id} not found`, 404);
    }
    return this.roomAmenityRepository.delete(id);
  }

  async deleteByRoomAndAmenityId(roomId: number, amenityId: number) {
    const deletedRoomAmenity = await this.findByRoomAndAmenityId(
      roomId,
      amenityId,
    );

    return this.roomAmenityRepository.delete(deletedRoomAmenity.id);
  }
}
