import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token?.replace('Bearer ', '') ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`Cliente ${client.id} rejeitado: sem token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub || payload.id;

      if (!userId) {
        this.logger.warn(`Cliente ${client.id} rejeitado: token inválido`);
        client.disconnect();
        return;
      }

      client.data.userId = userId;
      await client.join(`user_${userId}`);
      this.logger.log(`Usuário ${userId} conectado (socket: ${client.id})`);
    } catch (error) {
      this.logger.warn(`Cliente ${client.id} rejeitado: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket ${client.id} desconectado`);
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    try {
      await this.chatService.getMessages(data.conversationId, userId, 1, 1);
      const room = `conversation_${data.conversationId}`;
      await client.join(room);
      this.logger.log(`Usuário ${userId} entrou na room ${room}`);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number },
  ) {
    const room = `conversation_${data.conversationId}`;
    await client.leave(room);
    this.logger.log(`Socket ${client.id} saiu da room ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number; content: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    try {
      const message = await this.chatService.createMessage(
        data.conversationId,
        userId,
        data.content,
      );

      const messageWithConversation = {
        ...message,
        conversationId: data.conversationId,
      };

      this.server
        .to(`conversation_${data.conversationId}`)
        .emit('newMessage', messageWithConversation);

      const participantIds = await this.chatService.getParticipantIds(
        data.conversationId,
      );

      for (const participantId of participantIds) {
        const isInConversationRoom = await this.isUserInRoom(
          participantId,
          `conversation_${data.conversationId}`,
        );

        if (!isInConversationRoom) {
          this.server
            .to(`user_${participantId}`)
            .emit('newMessage', messageWithConversation);
        }
      }
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    const room = `conversation_${data.conversationId}`;
    client.to(room).emit('userTyping', {
      userId,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    try {
      await this.chatService.markAsRead(data.conversationId, userId);

      const room = `conversation_${data.conversationId}`;
      this.server.to(room).emit('messagesRead', {
        conversationId: data.conversationId,
        readByUserId: userId,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  private async isUserInRoom(userId: number, room: string): Promise<boolean> {
    const sockets = await this.server.in(`user_${userId}`).fetchSockets();
    for (const s of sockets) {
      if (s.rooms.has(room)) return true;
    }
    return false;
  }
}
