import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FilterRoomDto } from '../room/dto/filter-room.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Favorite')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar sala aos favoritos' })
  @ApiResponse({ status: 201, description: 'Favorito criado com sucesso' })
  create(@Req() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(req.user.userId, createFavoriteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar favoritos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de favoritos retornada' })
  findAll(@Req() req, @Query() filters: FilterRoomDto) {
    return this.favoriteService.findAll(req.user.userId, filters);
  }

  @Get('most-favoritdas')
  @ApiOperation({ summary: 'Listar salas mais favoritadas' })
  @ApiResponse({ status: 200, description: 'Lista de salas mais favoritadas' })
  findMostFavorited(
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.favoriteService.findMostFavorited(
      pageNumber ? +pageNumber : 1,
      pageSize ? +pageSize : 10,
    );
  }

  @Delete(':roomId')
  @ApiOperation({ summary: 'Remover sala dos favoritos' })
  @ApiResponse({ status: 204, description: 'Favorito removido com sucesso' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Param('roomId') roomId: string) {
    return this.favoriteService.remove(req.user.userId, +roomId);
  }
}
