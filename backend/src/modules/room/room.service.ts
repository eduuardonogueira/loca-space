import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { FilterRoomDto } from './dto/filter-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository, ILike } from 'typeorm';
import { RoomAmenitiesService } from '../room-amenities/room-amenities.service';
import { AvailabilityService } from '../availability/availability.service';
import { AppointmentService } from '../appointments/appointment.service';
import { EmailService } from '../email/email/email.service';
import { UserService } from '../user/user.service';
import { Favorite } from '../favorite/entities/favorite.entity';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private roomAmenitiesService: RoomAmenitiesService,
    private readonly availabilityService: AvailabilityService,
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async getRoomDetails(roomId: number, userId: number) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: {
        user: true,
        roomAmenities: {
          amenity: true,
        },
        address: true,
        favorites: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Sala não encontrada');
    }

    const isFavorite = userId
      ? room.favorites.some((fav) => fav.user.id === userId)
      : false;

    const availability = await this.availabilityService.findByRoom(roomId);
    const appointments = await this.appointmentService.findByRoom(roomId);

    return {
      room: {
        ...room,
        amenities:
          room.roomAmenities?.map((ra) => ({
            id: ra.amenity.id,
            name: ra.amenity.name,
          })) ?? [],
        advertise: {
          email: room.user.email,
          name: room.user.fullName,
          phone: room.user.phone,
        },
        isFavorite,
      },
      availability,
      appointments,
    };
  }

  async findAll(userId: number) {
    const findedRooms = await this.roomRepository.find({
      relations: {
        roomAmenities: {
          amenity: true,
        },
        address: true,
        favorites: {
          user: true,
        }, // carrega favoritos, mas user dentro pode ser undefined
      },
    });

    if (!findedRooms || findedRooms.length === 0) {
      throw new HttpException(`Rooms Not Found`, 404);
    }

    const formattedRooms = findedRooms.map((room) => {
      const isFavorite = userId
        ? room.favorites.some((fav) => fav.user.id === userId)
        : false;

      return {
        ...room,
        amenities:
          room.roomAmenities?.map((ra) => ({
            id: ra.amenity.id,
            name: ra.amenity.name,
          })) ?? [],
        isFavorite,
        roomAmenities: undefined,
        favorites: undefined,
      };
    });

    return formattedRooms;
  }

  async findByUser(userId: number) {
    const rooms = await this.roomRepository.find({
      where: { user: { id: userId } },
      relations: ['roomAmenities', 'roomAmenities.amenity'],
    });

    if (!rooms || rooms.length === 0) {
      throw new HttpException(
        'Nenhum espaço encontrado para este usuário',
        404,
      );
    }

    return rooms.map((room) => ({
      ...room,
      amenities: room.roomAmenities.map((ra) => ({
        id: ra.amenity.id,
        name: ra.amenity.name,
      })),
      roomAmenities: undefined,
    }));
  }

  async findByAddress(term: string) {
    const termLike = `%${term}%`;
    const findedRooms = await this.roomRepository.find({
      where: [
        { address: { street: ILike(termLike) } },
        { address: { bairro: ILike(termLike) } },
        { address: { city: ILike(termLike) } },
        { address: { state: ILike(termLike) } },
      ],
      relations: ['roomAmenities', 'roomAmenities.amenity', 'address'],
    });

    if (!findedRooms || findedRooms.length === 0) {
      return [];
    }

    const formatedAmenities = findedRooms.map((room) => ({
      ...room,
      amenities: room.roomAmenities.map((ra) => ({
        id: ra.amenity.id,
        name: ra.amenity.name,
      })),
      roomAmenities: undefined,
    }));

    return formatedAmenities;
  }

  async filterRooms(filters: FilterRoomDto) {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roomAmenities', 'roomAmenities')
      .leftJoinAndSelect('roomAmenities.amenity', 'amenity')
      .leftJoinAndSelect('room.address', 'address');

    if (filters.minPrice) {
      query.andWhere('room.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice) {
      query.andWhere('room.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters.minSize) {
      query.andWhere('room.size >= :minSize', {
        minSize: filters.minSize,
      });
    }

    if (filters.maxSize) {
      query.andWhere('room.size <= :maxSize', {
        maxSize: filters.maxSize,
      });
    }

    if (filters.minTotalSpace) {
      query.andWhere('room.totalSpace >= :minTotalSpace', {
        minTotalSpace: filters.minTotalSpace,
      });
    }

    if (filters.maxTotalSpace) {
      query.andWhere('room.totalSpace <= :maxTotalSpace', {
        maxTotalSpace: filters.maxTotalSpace,
      });
    }

    if (filters.amenities && filters.amenities.length > 0) {
      // Filter rooms that have AT LEAST ONE of the specified amenities
      query.innerJoin(
        'room.roomAmenities',
        'filterRa',
        'filterRa.amenityId IN (:...amenityIds)',
        { amenityIds: filters.amenities },
      );
    }

    const findedRooms = await query.getMany();

    if (!findedRooms || findedRooms.length === 0) {
      return [];
    }

    const formatedAmenities = findedRooms.map((room) => ({
      ...room,
      amenities: room.roomAmenities.map((ra) => ({
        id: ra.amenity.id,
        name: ra.amenity.name,
      })),
      roomAmenities: undefined,
    }));

    return formatedAmenities;
  }

  async findOne(id: number) {
    const findedRooms = await this.roomRepository.findOne({
      where: { id },
      relations: ['roomAmenities', 'roomAmenities.amenity'],
    });
    if (!findedRooms) {
      throw new HttpException(`Room with ID ${id} not found`, 404);
    }
    const formatedAmenities = {
      ...findedRooms,
      amenities: findedRooms.roomAmenities.map((ra) => ({
        id: ra.amenity.id,
        name: ra.amenity.name,
      })),
      roomAmenities: undefined,
    };

    return formatedAmenities;
  }

  async create(createRoomDto: CreateRoomDto, userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    console.log('User passado:', userId);
    const room = this.roomRepository.create({
      ...createRoomDto,
      user,
      createdAt: new Date(),
    });

    const createdRoom = await this.roomRepository.save(room);

    const { amenities } = createRoomDto;

    if (createRoomDto.amenities && createRoomDto.amenities.length > 0) {
      const roomAmenities = await Promise.all(
        amenities.map((amenityId) =>
          this.roomAmenitiesService.create({
            amenityId: amenityId,
            roomId: createdRoom.id,
          }),
        ),
      );

      const formatedRoom = {
        ...createRoomDto,
        amenities: [...roomAmenities.map((roomAmenity) => roomAmenity.amenity)],
      };

      return formatedRoom;
    }

    return createdRoom;
  }

  async update(roomId: number, updateRoomDto: UpdateRoomDto) {
    if (updateRoomDto.amenities) {
      const findedRoom = await this.findOne(roomId);
      const newAmenitiesIds = updateRoomDto.amenities;
      const currentAmenitiesIds = findedRoom.amenities.map((a) => a.id);

      const toRemove = currentAmenitiesIds.filter(
        (id) => !newAmenitiesIds.includes(id),
      );

      const toAdd = newAmenitiesIds.filter(
        (id) => !currentAmenitiesIds.includes(id),
      );

      if (toRemove.length > 0) {
        await Promise.all(
          toRemove.map((amenityId) =>
            this.roomAmenitiesService.deleteByRoomAndAmenityId(
              roomId,
              amenityId,
            ),
          ),
        );
      }

      if (toAdd.length > 0) {
        await Promise.all(
          toAdd.map((amenityId) =>
            this.roomAmenitiesService.create({ roomId, amenityId }),
          ),
        );
      }
    }

    const salaAntes = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    const precoAntigo = salaAntes?.price;
    if (!precoAntigo) {
      throw new HttpException(`Room with ID ${roomId} not found`, 404);
    }
    const room = await this.roomRepository.preload({
      id: roomId,
      ...updateRoomDto,
      updatedAt: new Date(),
    });

    if (!room) {
      throw new HttpException(`Room with ID ${roomId} not found`, 404);
    }

    const savedRoom = await this.roomRepository.save(room);

    if (updateRoomDto.price < precoAntigo) {
      const favorites = await this.favoriteRepository.find({
        where: { room: { id: roomId } },
        relations: ['user'],
      });

      if (favorites.length > 0) {
        const roomName = room.name || `Sala #${roomId}`;
        this.logger.log(
          `Price drop detected for "${roomName}": R$${precoAntigo} → R$${updateRoomDto.price}. Notifying ${favorites.length} user(s).`,
        );

        Promise.all(
          favorites.map((fav) =>
            this.emailService.sendPriceDropNotification(
              fav.user.email,
              roomName,
              precoAntigo,
              updateRoomDto.price,
              fav.user.fullName,
            ),
          ),
        ).catch((err) =>
          this.logger.warn(`Error sending price drop emails: ${err?.message}`),
        );
      }
    }

    return savedRoom;
  }

  async remove(id: number) {
    const foundRoom = await this.findOne(id);
    return this.roomRepository.delete(foundRoom.id);
  }
}
