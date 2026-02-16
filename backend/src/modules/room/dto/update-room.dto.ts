import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { EnumRoomStatus, EnumRoomType } from 'src/types/room';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Área total da sala em metros quadrados (m²)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalSpace: number;

  @ApiPropertyOptional({ example: 150.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Capacidade máxima de pessoas',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'Size must be a valid number' })
  size: number;

  @ApiPropertyOptional({ example: 'Bloco A' })
  @IsOptional()
  @IsString()
  endereco: string;


  @ApiPropertyOptional({ example: 'available' })
  @IsOptional()
  @IsEnum(EnumRoomStatus, {
    message: 'Status must be one of: available, scheduled, maintenance',
  })
  status: EnumRoomStatus;

  @IsOptional()
  @IsString()
  description: string | null;

  @ApiPropertyOptional({ example: 2, description: 'Número de vagas de estacionamento disponíveis' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  parkingSlots: number;

  @IsOptional()
  @IsString()
  imageUrl: string | null;

  @IsOptional()
  @IsEnum(EnumRoomType, { message: 'Type must be one of: SalaReuniao, Escritorio, Gerais' })
  type: EnumRoomType;
}
