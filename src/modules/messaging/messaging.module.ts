import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingGateway } from './messaging.gateway';
import { JwtModule } from '@nestjs/jwt';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({
  imports:[JwtModule],
  providers: [MessagingGateway,MessagingService,WsJwtGuard],
 
})
export class MessagingModule {}
