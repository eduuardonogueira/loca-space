import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { FilterRoomDto, orderMap } from './dto/filter-room.dto';
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
import { CloudinaryService } from '../cloudinary/cloudinary.service';

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
    private readonly cloudinaryService: CloudinaryService,
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
        },
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
      relations: {
        roomAmenities: {
          amenity: true,
        },
        address: true,
        favorites: {
          user: true,
        },
      },
    });

    if (!rooms || rooms.length === 0) {
      throw new HttpException(
        'Nenhum espaço encontrado para este usuário',
        404,
      );
    }

    return rooms.map((room) => {
      const isFavorite = userId
        ? room.favorites.some((fav) => fav.user.id === userId)
        : false;

      return {
        ...room,
        amenities: room.roomAmenities.map((ra) => ({
          id: ra.amenity.id,
          name: ra.amenity.name,
        })),
        isFavorite,
        roomAmenities: undefined,
        favorites: undefined,
      };
    });
  }

  async findByAddress(term: string, userId?: number) {
    const termLike = `%${term}%`;
    const findedRooms = await this.roomRepository.find({
      where: [
        { address: { street: ILike(termLike) } },
        { address: { bairro: ILike(termLike) } },
        { address: { city: ILike(termLike) } },
        { address: { state: ILike(termLike) } },
      ],
      relations: {
        roomAmenities: {
          amenity: true,
        },
        address: true,
        favorites: {
          user: true,
        },
      },
    });

    if (!findedRooms || findedRooms.length === 0) {
      return [];
    }

    const formatedAmenities = findedRooms.map((room) => {
      const isFavorite = userId
        ? room.favorites.some((fav) => fav.user.id === userId)
        : false;

      return {
        ...room,
        amenities: room.roomAmenities.map((ra) => ({
          id: ra.amenity.id,
          name: ra.amenity.name,
        })),
        isFavorite,
        roomAmenities: undefined,
        favorites: undefined,
      };
    });

    return formatedAmenities;
  }

  async filterRooms(filters: FilterRoomDto, userId?: number) {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roomAmenities', 'roomAmenities')
      .leftJoinAndSelect('roomAmenities.amenity', 'amenity')
      .leftJoinAndSelect('room.address', 'address')
      .leftJoinAndSelect('room.favorites', 'favorites')
      .leftJoinAndSelect('favorites.user', 'favUser');

    if (filters.address) {
      const termLike = `%${filters.address}%`;
      //select * from address where campos like '%os filtros que vierem%'
      query.andWhere(
        '(address.street ILIKE :term OR address.bairro ILIKE :term OR address.city ILIKE :term OR address.state ILIKE :term)',
        { term: termLike },
      );
    }

    if (filters.type) {
      query.andWhere('room.type = :type', { type: filters.type });
    }

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

    const findedRooms = await query.getMany();

    if (!findedRooms || findedRooms.length === 0) {
      return [];
    }

    const formatedAmenities = findedRooms.map((room) => {
      const isFavorite = userId
        ? room.favorites?.some((fav) => fav.user?.id === userId)
        : false;

      return {
        ...room,
        amenities: room.roomAmenities.map((ra) => ({
          id: ra.amenity.id,
          name: ra.amenity.name,
        })),
        isFavorite,
        roomAmenities: undefined,
        favorites: undefined,
      };
    });

    return formatedAmenities;
  }

  async findOne(id: number, userId?: number) {
    const findedRooms = await this.roomRepository.findOne({
      where: { id },
      relations: {
        roomAmenities: {
          amenity: true,
        },
        address: true,
        favorites: {
          user: true,
        },
      },
    });
    if (!findedRooms) {
      throw new HttpException(`Room with ID ${id} not found`, 404);
    }

    const isFavorite = userId
      ? findedRooms.favorites.some((fav) => fav.user.id === userId)
      : false;

    const formatedAmenities = {
      ...findedRooms,
      amenities: findedRooms.roomAmenities.map((ra) => ({
        id: ra.amenity.id,
        name: ra.amenity.name,
      })),
      isFavorite,
      roomAmenities: undefined,
      favorites: undefined,
    };

    return formatedAmenities;
  }

  async create(createRoomDto: CreateRoomDto, userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const room = this.roomRepository.create({
      ...createRoomDto,
      user,
      createdAt: new Date(),
    });

    const {
      user: as,
      userId: asq,
      ...createdRoom
    } = await this.roomRepository.save(room);

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
        ...createdRoom,
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

  async uploadBanner(roomId: number, file: Express.Multer.File) {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const result = await this.cloudinaryService.uploadFile(file);
    room.bannerUrl = result.secure_url;
    room.updatedAt = new Date();
    return this.roomRepository.save(room);
  }

  async uploadPhotos(roomId: number, files: Express.Multer.File[]) {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const uploadResults = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadFile(file)),
    );

    const newUrls = uploadResults.map((r) => r.secure_url);
    room.photoUrls = [...(room.photoUrls || []), ...newUrls];
    room.updatedAt = new Date();
    return this.roomRepository.save(room);
  }
}
