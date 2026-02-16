import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({ example: 1, description: 'ID da sala a favoritar' })
  @IsNotEmpty()
  @IsInt()
  roomId: number;
}
