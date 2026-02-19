import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';
import { User } from '../user/entities/user.entity';
import { Room } from '../room/entities/room.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');
    const room = await this.roomRepository.findOne({
      where: { id: dto.roomId },
    });
    if (!room) throw new NotFoundException('Room not found');
    const appointment = this.appointmentRepository.create({
      ...dto,
      user,
      room,
      createdAt: new Date(),
    });
    return this.appointmentRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({ relations: ['user', 'room'] });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'room'],
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async findByRoom(id: number) {
    const findedAppointment = await this.appointmentRepository.find({
      where: { room: { id } },
    });
    if (!findedAppointment)
      throw new NotFoundException('Appointment not found');

    return findedAppointment;
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    if (dto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: dto.userId },
      });
      if (!user) throw new NotFoundException('User not found');
      appointment.user = user;
    }
    if (dto.roomId) {
      const room = await this.roomRepository.findOne({
        where: { id: dto.roomId },
      });
      if (!room) throw new NotFoundException('Room not found');
      appointment.room = room;
    }
    Object.assign(appointment, dto);
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }
}
