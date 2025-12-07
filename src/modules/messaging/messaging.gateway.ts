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
import { MessagingService } from './messaging.service';
import { SendMessageDto } from './DTO/send-message.dto';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { UseGuards, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagingGateway.name);

  constructor(
    private readonly messagingService: MessagingService,
    private readonly prisma: PrismaService,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    // Extract token from auth
    const token = client.handshake.auth.token;
    
    if (!token) {
      this.logger.warn('Client connected without token, disconnecting');
      client.disconnect();
      return;
    }

    // For now, just accept the connection
    // We'll verify the token in the handlers
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.id;
    if (userId) {
      client.leave(`user:${userId}`);
      this.logger.debug(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    const token = client.handshake.auth.token;
    
    if (!token) {
      this.logger.warn('SendMessage: No token provided');
      return { status: 'error', message: 'Unauthorized' };
    }

    // You'll need to inject JwtService here
    // For now, payload should have senderId
    try {
      const message = await this.messagingService.sendMessage(payload.senderId, payload);
      this.server.to(`user:${payload.recieverId}`).emit('receiveMessage', message);
      this.logger.debug('Message sent:', payload);
      return { status: 'ok', message };
    } catch (err) {
      this.logger.error('Error sending message:', err);
      return { status: 'error', message: err.message };
    }
  }

  @SubscribeMessage('getMyMessages')
  async handleGetMessages(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;
    
    if (!token) {
      this.logger.warn('GetMessages: No token provided');
      return { status: 'error', message: 'Unauthorized' };
    }

    // For now, expect userId in the payload
    // You'll need to verify the token properly
    try {
      // We'll update this once we verify the token
      this.logger.debug('GetMessages request received');
      return { status: 'ok', message: 'Implement token verification' };
    } catch (err) {
      this.logger.error('Error getting messages:', err);
      return { status: 'error', message: err.message };
    }
  }

  async getReceivedMessages(userId: string) {
    const messages = await this.prisma.client.message.findMany({
      where: { recieverId: userId },
      include: {
        sender: true,
        reciever: true,
      },
      orderBy: {
        createdAt: 'asc',
      } as any,
    });
    return messages;
  }
}