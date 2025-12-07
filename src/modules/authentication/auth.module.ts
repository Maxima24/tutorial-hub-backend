import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../utils/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module'; 
import { VerificationService } from './../verification-service/verification-service.service';import { ConfigModule } from '@nestjs/config';
;

@Module({
  imports: [
  ConfigModule,
  PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,VerificationService],
  exports:[AuthService,VerificationService]
})
export class AuthModule {}
