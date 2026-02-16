import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './entities/availability.entity';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
} from './dto/availability.dto';
import { Room } from '../room/entities/room.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(dto: CreateAvailabilityDto): Promise<Availability> {
    const room = await this.roomRepository.findOne({
      where: { id: dto.roomId },
    });
    if (!room) throw new NotFoundException('Room not found');
    const availability = this.availabilityRepository.create({
      ...dto,
      room,
      createdAt: new Date(),
    });
    return this.availabilityRepository.save(availability);
  }

  async findAll(): Promise<Availability[]> {
    return this.availabilityRepository.find({ relations: ['room'] });
  }

  async findByRoom(roomId: number): Promise<Availability[]> {
    return this.availabilityRepository.find({
      where: { room: { id: roomId } },
    });
  }

  async findOne(id: number): Promise<Availability> {
    const availability = await this.availabilityRepository.findOne({
      where: { id },
      relations: ['room'],
    });
    if (!availability) throw new NotFoundException('Availability not found');
    return availability;
  }

  async update(id: number, dto: UpdateAvailabilityDto): Promise<Availability> {
    const availability = await this.findOne(id);
    if (dto.roomId) {
      const room = await this.roomRepository.findOne({
        where: { id: dto.roomId },
      });
      if (!room) throw new NotFoundException('Room not found');
      availability.room = room;
    }
    Object.assign(availability, dto, { updatedAt: new Date() });
    return this.availabilityRepository.save(availability);
  }

  async remove(id: number): Promise<void> {
    const availability = await this.findOne(id);
    await this.availabilityRepository.remove(availability);
  }
}
