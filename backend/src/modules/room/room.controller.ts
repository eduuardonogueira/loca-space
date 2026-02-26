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
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Lista todos os espaços disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de espaços retornados com sucesso.',
  })
  findAll(@Req() req: any) {
    const userId = +req.user.userId;
    return this.roomService.findAll(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('filter')
  @ApiOperation({ summary: 'Filtra salas por preço, capacidade e recursos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de salas filtradas.',
  })
  filter(@Query() filters: FilterRoomDto, @Req() req: any) {
    const userId = +req.user.userId;
    return this.roomService.filterRooms(filters, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-rooms')
  @ApiOperation({ summary: 'Lista os espaços criados pelo usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de espaços do usuário retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Nenhum espaço encontrado.' })
  findMyRooms(@Req() req: any, @Query() filters: FilterRoomDto) {
    return this.roomService.findByUser(+req.user.userId, filters);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Busca um espaço pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Espaço encontrado.' })
  @ApiResponse({ status: 404, description: 'Espaço não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = +req.user.userId;
    return this.roomService.findOne(id, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/details')
  @ApiOperation({
    summary: 'Retorna detalhes de um espaço, disponibilidade e agendamentos',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do espaço retornados com sucesso.',
  })
  async getRoomDetails(
    @Param('id', ParseIntPipe) roomId: number,
    @Req() req: any,
  ) {
    const userId = +req.user.userId;
    return await this.roomService.getRoomDetails(roomId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um espaço pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Espaço removida com sucesso.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/upload-banner')
  @ApiOperation({ summary: 'Upload do banner do espaco' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('banner'))
  @ApiResponse({ status: 200, description: 'Banner atualizado com sucesso.' })
  uploadBanner(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.roomService.uploadBanner(id, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/upload-photos')
  @ApiOperation({ summary: 'Envio de Ftos da Sala' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos'))
  @ApiResponse({ status: 200, description: 'Fotos atualizadas com sucesso.' })
  uploadPhotos(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.roomService.uploadPhotos(id, files);
  }
}
