import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EnumRoomType, EnumRoomStatus } from 'src/types/room';

export const orderMap = {
  'data-recente': { createdAt: 'DESC' },
  'data-antiga': { createdAt: 'ASC' },
  'maior-preço': { price: 'DESC' },
  'menor-preço': { price: 'ASC' },
  default: { createdAt: 'DESC' },
};

type OrderByType = keyof typeof orderMap;

export class FilterRoomDto {
  @ApiPropertyOptional({
    description: 'Busca por endereço (rua, bairro, cidade ou estado)',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  orderBy?: OrderByType | null;

  @ApiPropertyOptional({
    description: 'Tipo da sala',
    enum: EnumRoomType,
  })
  @IsOptional()
  @IsEnum(EnumRoomType)
  type?: EnumRoomType;

  @ApiPropertyOptional({
    description: 'Status da sala',
    enum: EnumRoomStatus,
  })
  @IsOptional()
  @IsEnum(EnumRoomStatus)
  status?: EnumRoomStatus;

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
