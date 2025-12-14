import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
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
}
