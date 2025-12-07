import { UploadVideoSchema } from 'src/modules/video/DTO/upload-video.dto';
import { IsArray, IsBoolean, IsString } from 'class-validator';
import { INestApplication } from '@nestjs/common';
import { Video } from '@prisma/client';
export class CreateCourseDto {
  @IsString()
  title: string;
  @IsArray()
  videos: Video[]
  @IsString()
  description: string;
  @IsString()
  thumbnailUrl: string;
  @IsString()
  userId: string;
  @IsBoolean()
  isPublished: boolean;
}
