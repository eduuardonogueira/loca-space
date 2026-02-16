import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;
}
