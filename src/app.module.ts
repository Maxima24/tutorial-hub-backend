import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/authentication/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { VideoModule } from './modules/video/video.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 makes ConfigService available everywhere
    }),
    PrismaModule,
    AuthModule,
    VideoModule,
  ],
})
export class AppModule {}
