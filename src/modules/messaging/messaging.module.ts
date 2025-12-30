import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingGateway } from './messaging.gateway';
import { JwtModule } from '@nestjs/jwt';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports:[JwtModule],
  providers: [MessagingGateway,PrismaService,MessagingService,WsJwtGuard],
 
})
export class MessagingModule {}
