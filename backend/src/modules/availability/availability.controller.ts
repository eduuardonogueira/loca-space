import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
} from './dto/availability.dto';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}

  @Post()
  @ApiOperation({ summary: 'Criar disponibilidade' })
  create(@Body() dto: CreateAvailabilityDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as disponibilidades' })
  findAll() {
    return this.service.findAll();
  }

  @Get('/room/:roomId')
  @ApiOperation({ summary: 'Listar disponibilidade por sala' })
  findByRoom(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.service.findByRoom(roomId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar disponibilidade por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar disponibilidade' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar disponibilidade' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
