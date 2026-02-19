import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnumRoomStatus } from 'src/types/room';
import { EnumRoomType } from 'src/types/room';
import { ValidateNested } from 'class-validator';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class CreateRoomDto {
  @ApiProperty({ example: 'Sala 101' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 50,
    description: 'Capacidade máxima de pessoas',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  totalSpace: number;

  @ApiProperty({ example: 150.0, description: 'Preço da sala por período/hora' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number' })
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 20,
    description: 'Área total da sala em metros quadrados (m²)',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'Size must be a valid number' })
  size: number;

  @ApiProperty({ type: CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty()
  address: CreateAddressDto;

  @ApiProperty({ example: 'available' })
  @IsNotEmpty()
  @IsEnum(EnumRoomStatus, {
    message: 'Status must be one of: available, scheduled, maintenance',
  })
  status: EnumRoomStatus;

  @ApiPropertyOptional({ example: 'A Sala de Reunião localizada no Edifício Mirai Offices foi projetada para oferecer conforto, privacidade e eficiência em encontros corporativos.' })
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiPropertyOptional({ example: 'https://imagem.com/sala.jpg' })
  @IsOptional()
  @IsString()
  imageUrl: string | null;

  @ApiPropertyOptional({ example: 2, description: 'Número de vagas de estacionamento disponíveis' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  parkingSlots: number;

  @ApiProperty({ example: 'SalaReuniao' })
  @IsNotEmpty()
  @IsEnum(EnumRoomType, { message: 'Type must be one of: SalaReuniao, Escritorio, Gerais' })
  type: EnumRoomType;

  @ApiProperty({ example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  amenities: number[];
}
