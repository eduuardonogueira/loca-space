import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Appointment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Criar agendamento' })
  create(@Req() req, @Body() dto: CreateAppointmentDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os agendamentos' })
  findAll() {
    return this.service.findAll();
  }

  @Get('/user')
  @ApiOperation({ summary: 'Listar todos os agendamentos' })
  findByUser(@Req() req: any) {
    return this.service.findByUserId(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar agendamento' })
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.service.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar agendamento' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
