import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { Room } from '../room/entities/room.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  /**
   * Busca uma conversa existente entre dois usuários ou cria uma nova.
   */
  async findOrCreateConversation(
    userAId: number,
    userBId: number,
    roomId: number,
  ) {
    if (userAId === userBId) {
      throw new BadRequestException(
        'Você não pode iniciar uma conversa consigo mesmo',
      );
    }

    // Verificar se o usuário alvo existe
    const targetUser = await this.userRepository.findOne({
      where: { id: userBId },
    });
    if (!targetUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se a sala existe
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    if (!room) {
      throw new NotFoundException('Sala não encontrada');
    }

    // Buscar conversa existente entre os dois usuários SOBRE esta sala
    const existing = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.participants', 'pA', 'pA.userId = :userAId', {
        userAId,
      })
      .innerJoin('conversation.participants', 'pB', 'pB.userId = :userBId', {
        userBId,
      })
      .leftJoinAndSelect('conversation.room', 'room')
      .leftJoinAndSelect('conversation.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('conversation.roomId = :roomId', { roomId })
      .getOne();

    if (existing) {
      return this.sanitizeConversation(existing, userAId);
    }

    // Criar nova conversa vinculada à sala
    const conversation = this.conversationRepository.create({ room });
    const savedConversation =
      await this.conversationRepository.save(conversation);

    // Adicionar participantes
    const participantA = this.participantRepository.create({
      conversation: savedConversation,
      user: { id: userAId } as User,
    });
    const participantB = this.participantRepository.create({
      conversation: savedConversation,
      user: { id: userBId } as User,
    });
    await this.participantRepository.save([participantA, participantB]);

    // Recarregar com relações
    const result = await this.conversationRepository.findOne({
      where: { id: savedConversation.id },
      relations: ['participants', 'participants.user', 'room'],
    });

    return this.sanitizeConversation(result!, userAId);
  }

  /**
   * Lista todas as conversas do usuário com última mensagem e contagem de não lidas.
   */
  async findConversationsByUser(userId: number) {
    // Buscar todas as conversas que o usuário participa
    const participations = await this.participantRepository.find({
      where: { user: { id: userId } },
      relations: [
        'conversation',
        'conversation.room',
        'conversation.participants',
        'conversation.participants.user',
      ],
    });

    const conversations = await Promise.all(
      participations.map(async (participation) => {
        const conversation = participation.conversation;

        // Buscar última mensagem
        const lastMessage = await this.messageRepository.findOne({
          where: { conversation: { id: conversation.id } },
          order: { createdAt: 'DESC' },
          relations: ['sender'],
        });

        // Contar mensagens não lidas (enviadas por outros)
        const unreadCount = await this.messageRepository.count({
          where: {
            conversation: { id: conversation.id },
            isRead: false,
            sender: { id: Not(userId) },
          },
        });

        return {
          conversationId: conversation.id,
          room: conversation.room
            ? {
                id: conversation.room.id,
                name: conversation.room.name,
                price: conversation.room.price,
                bannerUrl: conversation.room.bannerUrl,
              }
            : null,
          participants: conversation.participants
            .filter((p) => p.user.id !== userId)
            .map((p) => ({
              userId: p.user.id,
              fullName: p.user.fullName,
              avatarUrl: p.user.avatarUrl,
            })),
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                senderId: lastMessage.sender.id,
                createdAt: lastMessage.createdAt,
              }
            : null,
          unreadCount,
          updatedAt: conversation.updatedAt,
        };
      }),
    );

    // Ordenar por updatedAt DESC
    return conversations.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  /**
   * Retorna mensagens paginadas de uma conversa (valida que o usuário é participante).
   */
  async getMessages(
    conversationId: number,
    userId: number,
    page = 1,
    limit = 50,
  ) {
    await this.validateParticipant(conversationId, userId);

    const [messages, total] = await this.messageRepository.findAndCount({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['sender'],
    });

    return {
      data: messages.map((msg) => ({
        id: msg.id,
        senderId: msg.sender.id,
        senderName: msg.sender.fullName,
        senderAvatar: msg.sender.avatarUrl,
        content: msg.content,
        isRead: msg.isRead,
        createdAt: msg.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Cria e salva uma mensagem. Atualiza updatedAt da conversa.
   */
  async createMessage(
    conversationId: number,
    senderId: number,
    content: string,
  ) {
    await this.validateParticipant(conversationId, senderId);

    const message = this.messageRepository.create({
      conversation: { id: conversationId } as Conversation,
      sender: { id: senderId } as User,
      content,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Atualizar updatedAt da conversa
    await this.conversationRepository.update(conversationId, {
      updatedAt: new Date(),
    });

    // Recarregar com relações do sender
    const fullMessage = await this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender'],
    });

    return {
      id: fullMessage!.id,
      conversationId,
      senderId: fullMessage!.sender.id,
      senderName: fullMessage!.sender.fullName,
      senderAvatar: fullMessage!.sender.avatarUrl,
      content: fullMessage!.content,
      isRead: fullMessage!.isRead,
      createdAt: fullMessage!.createdAt,
    };
  }

  /**
   * Marca como lidas todas as mensagens recebidas pelo userId naquela conversa.
   */
  async markAsRead(conversationId: number, userId: number) {
    await this.validateParticipant(conversationId, userId);

    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('senderId != :userId', { userId })
      .andWhere('isRead = false')
      .execute();

    return { success: true };
  }

  /**
   * Verifica se o userId é participante da conversa.
   */
  private async validateParticipant(conversationId: number, userId: number) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada');
    }

    const participant = await this.participantRepository.findOne({
      where: {
        conversation: { id: conversationId },
        user: { id: userId },
      },
    });

    if (!participant) {
      throw new ForbiddenException('Você não é participante desta conversa');
    }

    return conversation;
  }

  /**
   * Remove dados sensíveis e formata a saída de uma conversa.
   */
  private sanitizeConversation(
    conversation: Conversation,
    currentUserId: number,
  ) {
    return {
      id: conversation.id,
      room: conversation.room
        ? {
            id: conversation.room.id,
            name: conversation.room.name,
            price: conversation.room.price,
            bannerUrl: conversation.room.bannerUrl,
          }
        : null,
      participants: conversation.participants
        .filter((p) => p.user.id !== currentUserId)
        .map((p) => ({
          userId: p.user.id,
          fullName: p.user.fullName,
          avatarUrl: p.user.avatarUrl,
        })),
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  async getParticipantIds(conversationId: number): Promise<number[]> {
    const participants = await this.participantRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['user'],
    });
    return participants.map((p) => p.user.id);
  }
}
