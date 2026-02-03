import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ChatsController],
  providers: [PrismaService,ChatsService],
})
export class ChatsModule {}
