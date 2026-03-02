import { IsInt, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    example: 'PENDING',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    description: 'Status do agendamento',
  })
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED'])
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';

  @ApiProperty({
    example: '01/03/2025 08:00',
    description: 'Data e horário de início do agendamento',
  })
  @IsString()
  startDateTime: string;

  @ApiProperty({
    example: '02/03/2025 09:00',
    description: 'Data e horário de fim do agendamento',
  })
  @IsString()
  endDateTime: string;

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
    description: 'ID da sala',
  })
  @IsInt()
  roomId: number;

  @ApiProperty({
    example: 150.0,
    description: 'Valor total do agendamento',
  })
  @IsNumber()
  totalValue: number;

  @ApiProperty({
    example: 50.0,
    description: 'Preço cobrado por hora',
  })
  @IsNumber()
  price: number;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    example: 'PENDING',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    description: 'Status do agendamento',
  })
  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED'])
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';

  @ApiPropertyOptional({
    example: '01/03/2025 08:00',
    description: 'Data e horário de início do agendamento',
  })
  @IsOptional()
  @IsString()
  startDateTime?: string;

  @ApiPropertyOptional({
    example: '02/03/2025 09:00',
    description: 'Data e horário de fim do agendamento',
  })
  @IsOptional()
  @IsString()
  endDateTime?: string;

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
    description: 'ID da sala',
  })
  @IsOptional()
  @IsInt()
  roomId?: number;

  @ApiPropertyOptional({
    example: 150.0,
    description: 'Valor total do agendamento',
  })
  @IsOptional()
  @IsNumber()
  totalValue?: number;

  @ApiPropertyOptional({
    example: 50.0,
    description: 'Preço cobrado por hora',
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class DeleteAppointmentDto {
  @IsInt()
  id: number;
}
