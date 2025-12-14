// ...existing code...
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AppointmentService } from '../appointments/appointment.service';
import { UserDetailsDto } from './dto/user-details.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly appointmentService: AppointmentService,
  ) {}
  async getUserDetails(id: number): Promise<UserDetailsDto> {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const appointments = await this.appointmentService.findAll();
    const userAppointments = appointments
      .filter((a) => a.user.id === id)
      .map((a) => ({
        id: a.id,
        order: a.order,
        status: a.status,
        date: a.date,
        startTime: a.startTime,
        endTime: a.endTime,
        details: a.details,
        title: a.title,
        room: {
          id: a.room.id,
          name: a.room.name,
          location: a.room.location,
          capacity: a.room.capacity,
          status: a.room.status,
          description: a.room.description,
          imageUrl: a.room.imageUrl,
        },
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }));
    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        type: user.type,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      appointments: userAppointments,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto as Partial<User>);
    user.createdAt = new Date();
    return this.userRepository.save(user);
  }

  async findAll(page: number = 1, size: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: { id: 'ASC' },
    });
    return {
      data: users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        type: user.type,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / size),
        size,
      },
    };
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      updatedAt: new Date(),
    });

    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
