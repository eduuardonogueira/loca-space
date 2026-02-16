import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilterRoomDto } from './dto/filter-room.dto';

@ApiTags('Espaço')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo espaço' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({ status: 200, description: 'Espaço criado com sucesso.' })
  create(@Body() createRoomDto: CreateRoomDto, @Req() req: any) {
    return this.roomService.create(createRoomDto, +req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edita uma espaço' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({ status: 200, description: 'Espaço editado com sucesso.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os espaços disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de espaços retornados com sucesso.',
  })
  findAll() {
    return this.roomService.findAll();
  }

  @Get('searchLocation')
  @ApiOperation({ summary: 'Busca salas por endereço (rua, bairro, cidade, estado)' })
  @ApiQuery({
    name: 'address',
    required: true,
    description: 'Termo de busca no endereço',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de salas filtradas.',
  })
  search(@Query('address') address: string) {
    return this.roomService.findByAddress(address);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filtra salas por preço, capacidade e recursos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de salas filtradas.',
  })
  filter(@Query() filters: FilterRoomDto) {
    return this.roomService.filterRooms(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um espaço pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Espaço encontrado.' })
  @ApiResponse({ status: 404, description: 'Espaço não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.findOne(id);
  }

  @Get(':id/details')
  @ApiOperation({
    summary: 'Retorna detalhes de um espaço, disponibilidade e agendamentos',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do espaço retornados com sucesso.',
  })
  async getRoomDetails(@Param('id', ParseIntPipe) id: number) {
    return await this.roomService.getRoomDetails(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um espaço pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Espaço removida com sucesso.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.remove(id);
  }
}
