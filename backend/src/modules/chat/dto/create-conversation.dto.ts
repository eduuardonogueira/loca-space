import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    description: 'ID do usuário com quem iniciar a conversa',
    example: 5,
  })
  @IsNumber()
  targetUserId: number;

  @ApiProperty({
    description: 'ID da sala sobre a qual a conversa será iniciada',
    example: 1,
  })
  @IsNumber()
  roomId: number;
}
