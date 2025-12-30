import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService,CoursesService],
  controllers: [CoursesController]
})
export class CoursesModule {}
