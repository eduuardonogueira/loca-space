import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dto/create-address.dto';
import { EnumUserRole, EnumUserType } from 'src/types/user';

export class CreateUserDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'joao@email.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'senha123' })
  password: string;

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

  @IsNotEmpty()
  @IsEnum(EnumUserType, {
    message: 'Type must be one of: docente, discente, tecnico, externo',
  })
  @ApiProperty({ example: 'docente, discente, tecnico, externo' })
  type: EnumUserType;

  @IsNotEmpty()
  @IsEnum(EnumUserRole, { message: 'Role must be one of: user, admin' })
  @ApiProperty({ example: 'user, admin' })
  role: EnumUserRole;

  @ApiProperty({ type: CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty()
  address: CreateAddressDto;
}
