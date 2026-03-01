import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'ID da conversa', example: 1 })
  @IsNumber()
  conversationId: number;

  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Olá! A sala está disponível?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
