import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';
import { User } from '../user/entities/user.entity';
import { Room } from '../room/entities/room.entity';
import { EmailService } from '../email/email/email.service';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly emailService: EmailService,
  ) {}

  private parseDateTime(dateTimeString: string): Date {
    // "01/03/2025 08:00" -> DD/MM/YYYY HH:mm
    const [datePart, timePart] = dateTimeString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');
    return new Date(+year, +month - 1, +day, +hour, +minute);
  }

  async create(
    userId: number,
    dto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');
    const room = await this.roomRepository.findOne({
      where: { id: dto.roomId },
    });
    if (!room) throw new NotFoundException('Room not found');

    const startDateTime = this.parseDateTime(dto.startDateTime);
    const endDateTime = this.parseDateTime(dto.endDateTime);

    const appointment = this.appointmentRepository.create({
      ...dto,
      startDateTime,
      endDateTime,
      user,
      room,
      createdAt: new Date(),
    });
    const savedAppointment = await this.appointmentRepository.save(appointment);

    const roomName = room.name || `Sala #${room.id}`;
    this.emailService
      .sendAppointmentNotification(
        user.email,
        user.fullName,
        roomName,
        dto.startDateTime,
        dto.endDateTime,
        dto.title,
      )
      .catch((err) =>
        this.logger.warn(`Error sending appointment email: ${err?.message}`),
      );

    return savedAppointment;
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

  async update(
    id: number,
    userId: number,
    dto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
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

    const updatedProperties: any = { ...dto };

    if (dto.startDateTime) {
      updatedProperties.startDateTime = this.parseDateTime(dto.startDateTime);
    }
    if (dto.endDateTime) {
      updatedProperties.endDateTime = this.parseDateTime(dto.endDateTime);
    }

    Object.assign(appointment, updatedProperties);
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }
}
