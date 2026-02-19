import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, Min } from 'class-validator';

export class FilterRoomDto {
  @ApiPropertyOptional({ description: 'Preço mínimo (por hora/período)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Preço máximo (por hora/período)' })
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
    description: 'IDs de recursos/amenities (ex: 1,2,3)',
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
