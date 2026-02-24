import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { EnumRoomStatus, EnumRoomType } from 'src/types/room';

export class FilterRoomDto {
  @ApiPropertyOptional({
    description: 'Busca por endereço (rua, bairro, cidade ou estado)',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Status da sala',
    enum: EnumRoomStatus,
  })
  @IsOptional()
  @IsEnum(EnumRoomStatus)
  status?: EnumRoomStatus;

  @ApiPropertyOptional({
    description: 'Tipo da sala',
    enum: EnumRoomType,
  })
  @IsOptional()
  @IsEnum(EnumRoomType)
  type?: EnumRoomType;

  @ApiPropertyOptional({ description: 'Preço mínimo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Preço máximo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Área mínima (m²)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minSize?: number;

  @ApiPropertyOptional({ description: 'Área máxima (m²)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxSize?: number;

  @ApiPropertyOptional({ description: 'Capacidade mínima (Pessoas)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minTotalSpace?: number;

  @ApiPropertyOptional({ description: 'Capacidade máxima (Pessoas)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxTotalSpace?: number;

  @ApiPropertyOptional({
    description: 'Recursos (Ex: 1,3,4) ',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(Number);
    }
    if (typeof value === 'string') {
        if (value.includes(',')) {
            return value.split(',').map(Number);
        }
        return [Number(value)];
    }
    return [Number(value)];
  })
  @IsArray()
  @IsNumber({}, { each: true })
  amenities?: number[];
}
