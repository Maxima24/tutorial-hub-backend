import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MessagingService } from '../messaging/messaging.service';

@Module({
  controllers: [ChatsController],
  providers: [PrismaService,ChatsService,MessagingService],
})
export class ChatsModule {}
