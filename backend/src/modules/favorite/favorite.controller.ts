import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  create(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(req.user.userId, createFavoriteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar favoritos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de favoritos retornada' })
  findAll(@Request() req) {
    return this.favoriteService.findAll(req.user.userId);
  }

  @Delete(':roomId')
  @ApiOperation({ summary: 'Remover sala dos favoritos' })
  @ApiResponse({ status: 204, description: 'Favorito removido com sucesso' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req, @Param('roomId') roomId: string) {
    return this.favoriteService.remove(req.user.userId, +roomId);
  }
}
