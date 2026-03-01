import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Room } from '../room/entities/room.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FilterRoomDto, orderMap } from '../room/dto/filter-room.dto';

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

  async findAll(userId: number, filters?: FilterRoomDto) {
    const query = this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.room', 'room')
      .leftJoinAndSelect('room.roomAmenities', 'roomAmenities')
      .leftJoinAndSelect('roomAmenities.amenity', 'amenity')
      .leftJoinAndSelect('room.address', 'address')
      .where('favorite.userId = :userId', { userId });

    if (filters) {
      if (filters.address) {
        const termLike = `%${filters.address}%`;
        query.andWhere(
          '(address.street ILIKE :term OR address.bairro ILIKE :term OR address.city ILIKE :term OR address.state ILIKE :term)',
          { term: termLike },
        );
      }

      if (filters.type) {
        query.andWhere('room.type = :type', { type: filters.type });
      }

      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        query.andWhere('room.price >= :minPrice', {
          minPrice: filters.minPrice,
        });
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        query.andWhere('room.price <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }
      if (filters.minSize !== undefined && filters.minSize !== null) {
        query.andWhere('room.size >= :minSize', { minSize: filters.minSize });
      }
      if (filters.maxSize !== undefined && filters.maxSize !== null) {
        query.andWhere('room.size <= :maxSize', { maxSize: filters.maxSize });
      }
      if (
        filters.minTotalSpace !== undefined &&
        filters.minTotalSpace !== null
      ) {
        query.andWhere('room.totalSpace >= :minTotalSpace', {
          minTotalSpace: filters.minTotalSpace,
        });
      }
      if (
        filters.maxTotalSpace !== undefined &&
        filters.maxTotalSpace !== null
      ) {
        query.andWhere('room.totalSpace <= :maxTotalSpace', {
          maxTotalSpace: filters.maxTotalSpace,
        });
      }

      if (filters.status) {
        query.andWhere('room.status = :status', { status: filters.status });
      }

      if (filters.amenities && filters.amenities.length > 0) {
        query.innerJoin(
          'room.roomAmenities',
          'filterRa',
          'filterRa.amenityId IN (:...amenityIds)',
          { amenityIds: filters.amenities },
        );
      }

      const order = orderMap[filters.orderBy ?? 'default'];
      for (const [column, direction] of Object.entries(order)) {
        query.addOrderBy(`room.${column}`, direction as 'ASC' | 'DESC');
      }
    } else {
      query.addOrderBy('favorite.createdAt', 'DESC');
    }

    const favorites = await query.getMany();

    const data = favorites.map((fav) => ({
      ...fav.room,
      amenities:
        fav.room.roomAmenities?.map((ra) => ({
          id: ra.amenity.id,
          name: ra.amenity.name,
        })) ?? [],
      isFavorite: true,
      roomAmenities: undefined,
    }));

    return data;
  }

  async findMostFavorited(
    pageNumber: number = 1,
    pageSize: number = 10,
    userId?: number,
  ) {
    if (pageNumber <= 0 || pageSize <= 0) {
      throw new BadRequestException('Page Number ou Page Size inválidos');
    }
    const offset = (pageNumber - 1) * pageSize;

    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.favorites', 'favorite')
      .leftJoinAndSelect('room.roomAmenities', 'roomAmenities')
      .leftJoinAndSelect('roomAmenities.amenity', 'amenity')
      .leftJoinAndSelect('room.address', 'address')
      .addSelect('COUNT(favorite.id)', 'favoriteCount')
      .groupBy('room.id')
      .addGroupBy('roomAmenities.id')
      .addGroupBy('amenity.id')
      .addGroupBy('address.id')
      .orderBy('"favoriteCount"', 'DESC')
      .offset(offset)
      .limit(pageSize);

    const rooms = await query.getRawAndEntities();

    const total = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.favorites', 'favorite')
      .select('room.id')
      .groupBy('room.id')
      .getCount();

    const userFavoriteRoomIds = new Set<number>();
    if (userId) {
      const userFavorites = await this.favoriteRepository.find({
        where: { user: { id: userId } },
        relations: ['room'],
      });
      userFavorites.forEach((fav) => userFavoriteRoomIds.add(fav.room.id));
    }

    const data = rooms.entities.map((room, index) => ({
      ...room,
      amenities:
        room.roomAmenities?.map((ra) => ({
          id: ra.amenity.id,
          name: ra.amenity.name,
        })) ?? [],
      totalFavorited: Number(rooms.raw[index]?.favoriteCount || 0),
      isFavorite: userFavoriteRoomIds.has(room.id),
      roomAmenities: undefined,
    }));

    return {
      data,
      total,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
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
