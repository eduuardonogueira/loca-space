import { IsInt, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1, description: 'Ordem do agendamento' })
  @IsInt()
  order: number;

  @ApiProperty({
    example: 'PENDING',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    description: 'Status do agendamento',
  })
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED'])
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';

  @ApiProperty({
    example: '2025-09-18',
    description: 'Data do agendamento',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: '08:00',
    description: 'Horário de início',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    example: '09:00',
    description: 'Horário de fim',
  })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({
    example: 'Reunião importante',
    description: 'Detalhes do agendamento',
  })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiProperty({
    example: 'Reunião',
    description: 'Título do agendamento',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 1,
    description: 'ID do usuário',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'ID da sala',
  })
  @IsInt()
  roomId: number;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Ordem do agendamento',
  })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({
    example: 'PENDING',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    description: 'Status do agendamento',
  })
  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED'])
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';

  @ApiPropertyOptional({
    example: '2025-09-18',
    description: 'Data do agendamento',
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({
    example: '08:00',
    description: 'Horário de início',
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    example: '09:00',
    description: 'Horário de fim',
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    example: 'Reunião importante',
    description: 'Detalhes do agendamento',
  })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({
    example: 'Reunião',
    description: 'Título do agendamento',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID do usuário',
  })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID da sala',
  })
  @IsOptional()
  @IsInt()
  roomId?: number;
}

export class DeleteAppointmentDto {
  @IsInt()
  id: number;
}
