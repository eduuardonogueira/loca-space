import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ example: '66014-180' })
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty({ example: 'Av. Perimetral' })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ example: '3004' })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({ example: 'Apto 716', required: false })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ example: 'Guamá' })
  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @ApiProperty({ example: 'Pará' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'PA' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: '91988887777', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Masculino', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: '1998-05-15', required: false })
  @IsOptional()
  @IsString()
  birthDate?: string;
}