import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Room } from '../room/entities/room.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(userId: number, createFavoriteDto: CreateFavoriteDto) {
    const { roomId } = createFavoriteDto;

    const room = await this.roomRepository.findOne({ where: { id: roomId } });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const exists = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        room: { id: roomId },
      },
    });

    if (exists) {
      throw new ConflictException('Room already favorited');
    }

    const favorite = this.favoriteRepository.create({
      user: { id: userId },
      room,
    });

    return await this.favoriteRepository.save(favorite);
  }

  async findAll(userId: number) {
    const favorites = await this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['room', 'room.address', 'room.roomAmenities', 'room.roomAmenities.amenity'],
      order: { createdAt: 'DESC' },
    });
    
    // Transform formatting if RoomService has specific formatting logic, but here raw is fine or minimal mapping.
    // Return the room objects directly or the favorite wrapper? Usually return rooms.
    // The user asked "listar favoritos", so returning favorite wrapper is standard REST, included relations.
    return favorites;
  }

  async remove(userId: number, roomId: number) {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        room: { id: roomId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return await this.favoriteRepository.remove(favorite);
  }
}
