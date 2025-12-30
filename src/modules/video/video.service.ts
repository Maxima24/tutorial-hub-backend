import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { CreateVideoDto } from "./dto/create-video.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  constructor(private readonly db: PrismaService) {}
  async create(data: CreateVideoDto) {
    try {
      const videoData: Prisma.VideoUncheckedCreateInput = {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        duration: Math.round(data.duration), // Ensure it's an integer
        difficulty: data.difficulty,
        price: data.price,
        videoPublicId: data.videoPublicId,
        userId: data.userId,
        ...(data.courseId && { courseId: data.courseId }),
        ...(data.thumbnailUrl && { thumbnailUrl: data.thumbnailUrl }),
      };

      console.log("Creating video with data:", videoData);

      return await this.db.video.create({
        data: videoData,
      });
    } catch (error) {
      console.error("Prisma error details:", error);
      throw error;
    }
  }
  async findAllVideos() {
    try {
      const videos = await this.db.video.findMany({});
      if (!videos) {
        throw new NotFoundException("There are no videos available ");
      }
      return videos;
    } catch (err) {
      if (err instanceof HttpException) {
        return err;
      } else {
        return new InternalServerErrorException("Something went wrong", err);
      }
    }
  }
  async findById(id: string) {
    try {
      const video = await this.db.video.findFirst({
        where: { id },
      });
      if (!video) {
        throw new NotFoundException(`Video with the id ${id} was not found`);
      }
      return {
        message: "Video retrieved successfully",
        video,
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        return err;
      } else {
        return new InternalServerErrorException("Something went wrong", err);
      }
    }
  }
  async delete(id: string) {
    await this.db.video.delete({
      where: { id },
    });
    return {
      message: "Video deleted successfully",
    };
  }
}
