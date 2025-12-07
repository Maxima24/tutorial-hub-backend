import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard {
    private logger = new Logger(WsJwtGuard.name)
  constructor(private jwtService: JwtService) {}

  canActivate(socket: Socket) {
    const token = socket.handshake.auth.token;

    if (!token) {
     this.logger.debug('No token provided');
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token);
      socket.data.user = decoded;
     this.logger.debug('Token verified, user:', decoded);
      return true;
    } catch (err) {
      this.logger.debug('Token verification failed:', err.message);
      return false;
    }
  }
}