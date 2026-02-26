import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from '../user/entities/user.entity';
import { Room } from '../room/entities/room.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { EmailModule } from '../email/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Room]), EmailModule],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}
