import { IsInt, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAvailabilityDto {
  @ApiProperty({
    example: 1,
    description: 'Dia da semana (0=Domingo, 1=Segunda, ...)',
  })
  @IsInt()
  weekday: number;

  @ApiProperty({
    example: '08:00',
    description: 'Horário de início',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    example: '18:00',
    description: 'Horário de fim',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    example: 1,
    description: 'ID da sala',
  })
  @IsInt()
  roomId: number;
}

export class UpdateAvailabilityDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Dia da semana (0=Domingo, 1=Segunda, ...)',
  })
  @IsOptional()
  @IsInt()
  weekday?: number;

  @ApiPropertyOptional({
    example: '08:00',
    description: 'Horário de início',
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    example: '18:00',
    description: 'Horário de fim',
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID da sala',
  })
  @IsOptional()
  @IsInt()
  roomId?: number;
}

export class DeleteAvailabilityDto {
  @ApiProperty({
    example: 1,
    description: 'ID da disponibilidade',
  })
  @IsInt()
  id: number;
}
