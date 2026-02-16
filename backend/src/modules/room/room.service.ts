import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { FilterRoomDto } from './dto/filter-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository, ILike } from 'typeorm';
import { RoomAmenitiesService } from '../room-amenities/room-amenities.service';
import { AvailabilityService } from '../availability/availability.service';
import { AppointmentService } from '../appointments/appointment.service';

import { UserService } from '../user/user.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private roomAmenitiesService: RoomAmenitiesService,
    private readonly availabilityService: AvailabilityService,
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
  ) {}

  async getRoomDetails(id: number) {
    const room = await this.findOne(id);
    const availability = await this.availabilityService.findByRoom(id);
    const appointments = await this.appointmentService.findByRoom(id);
    return {
      room,
      availability,
      appointments,
    };
  }

  async findAll() {
    const findedRooms = await this.roomRepository.find({
      relations: ['roomAmenities', 'roomAmenities.amenity'],
    });
    if (!findedRooms) {
      throw new HttpException(`Rooms Not Found`, 404);
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
    console.log('User passado:',userId)
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

    const room = await this.roomRepository.preload({
      id: roomId,
      ...updateRoomDto,
      updatedAt: new Date(),
    });

    if (!room) {
      throw new HttpException(`Room with ID ${roomId} not found`, 404);
    }

    return this.roomRepository.save(room);
  }

  async remove(id: number) {
    const foundRoom = await this.findOne(id);
    return this.roomRepository.delete(foundRoom.id);
  }
}
