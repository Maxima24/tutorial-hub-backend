import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { AuthModule } from './modules/authentication/auth.module';
import { VideoModule } from './modules/video/video.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { LoggerMiddleware } from './common/middleware/middleware';
import { MessagingModule } from './modules/messaging/messaging.module';
import { CoursesModule } from './modules/courses/courses.module';
import { CoursesController } from './module/courses/courses.controller';

@Module({
  imports: [
    // ConfigModule - MUST be first and global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // JWT Module - after ConfigModule
JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '15m' as any, // Type assertion to bypass TypeScript check
          },
        };
      },
    }),

    // Passport Module
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Mailer Module
   MailerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const mailHost = configService.get<string>('MAIL_HOST');
    const mailPort = configService.get<string>('MAIL_PORT');
    const mailUser = configService.get<string>('MAIL_USER');
    const mailPassword = configService.get<string>('MAIL_PASSWORD');
    const mailFrom = configService.get<string>('MAIL_FROM');

    // Validate required environment variables
    if (!mailHost || !mailPort || !mailUser || !mailPassword) {
      console.warn('⚠️ Warning: Mail environment variables are missing');
    }

    return {
      transport: {
        host: mailHost,
        port: parseInt(mailPort || '587', 10),
        secure: mailPort === '465', // true for 465, false for other ports
        auth: {
          user: mailUser,
          pass: mailPassword,
        },
      },
      defaults: {
        from: mailFrom || 'noreply@yourapp.com',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      // Optional: preview mode (useful for development)
      preview: process.env.NODE_ENV === 'development',
    };
  },
}),
    // Your modules
    AuthModule,
    VideoModule,
    MessagingModule,
    CoursesModule,
  ],
  providers: [PrismaService],
  controllers: [CoursesController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}