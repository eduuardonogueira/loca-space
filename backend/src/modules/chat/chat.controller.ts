import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Criar ou buscar conversa com outro usuário' })
  @ApiResponse({
    status: 201,
    description: 'Conversa criada ou existente retornada',
  })
  createConversation(@Req() req, @Body() dto: CreateConversationDto) {
    return this.chatService.findOrCreateConversation(
      req.user.userId,
      dto.targetUserId,
      dto.roomId,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Listar todas as conversas do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de conversas retornada' })
  findConversations(@Req() req) {
    return this.chatService.findConversationsByUser(req.user.userId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Buscar mensagens de uma conversa com paginação' })
  @ApiResponse({ status: 200, description: 'Mensagens retornadas' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getMessages(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getMessages(
      id,
      req.user.userId,
      page ? +page : 1,
      limit ? +limit : 50,
    );
  }

  @Patch('conversations/:id/read')
  @ApiOperation({ summary: 'Marcar mensagens da conversa como lidas' })
  @ApiResponse({ status: 200, description: 'Mensagens marcadas como lidas' })
  markAsRead(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.chatService.markAsRead(id, req.user.userId);
  }
}
