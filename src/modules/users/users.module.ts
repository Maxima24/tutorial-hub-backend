import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  controllers: [UsersController],
  imports:[PrismaModule],
  providers: [UsersService,PrismaService],
})
export class UsersModule {}
