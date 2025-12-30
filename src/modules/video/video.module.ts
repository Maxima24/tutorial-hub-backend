import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Module({
  providers: [VideoService,PrismaService],
  controllers: [VideoController]
})
export class VideoModule {}
