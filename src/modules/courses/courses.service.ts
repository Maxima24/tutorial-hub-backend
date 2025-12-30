import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  CourseCreateDto,
  CourseFindDTO,
  PartialCourseFindDTO,
} from './dto/course.create.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CourseCreateDto) {
    try {
      const { video, ...newData } = data;
      const { userId, courseName } = newData;
      const user = await this.db.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with the id ${userId} was not found `,
        );
      }
      const videos = await Promise.all(
        video.map((id) =>
          this.db.video.findUnique({
            where: { id },
          }),
        ),
      );
      const validVideos = videos.filter((v) => v !== null);
      const arrangedVideos = validVideos.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );

      const course = await this.db.course.create({
        data: {
          ...newData,
          videos: {
            connect: arrangedVideos.map((v) => ({ id: v.id })),
          },
          title: courseName,
        },
      });
      if (!course) {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (err) {
      if (err instanceof HttpException) {
        return err;
      }
    }
  }
  async findCourse(data: CourseFindDTO) {
    try {
      const { courseId } = data;
      const course = this.db.course.findFirst({
        where: { id: courseId },
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return {
        success: true,
        data: {
          course,
        },
      };
    } catch (err) {
      if (err instanceof HttpException) {
        return err;
      } else {
        throw new HttpException(
          'something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async findCourseByName(data: PartialCourseFindDTO) {
    {
      try {
        const { name } = data;
        const course = await this.db.course.findMany({
          where: { title: { contains: name, mode: 'insensitive' } },
        });
        if (!course) {
          throw new NotFoundException(
            `Courses with the name ${name} Could not be found`,
          );
        }
        return {
          success: true,
          data: {
            ...course,
          },
        };
      } catch (err:any) {
        if (err instanceof HttpException) {
          return err;
        } else {
          return new InternalServerErrorException('Something went wrong', err);
        }
      }
    }
  }
  async delete(id: string) {
    try {
      const deleted = await this.db.video.delete({
        where: { id },
      });
      if (!deleted) {
        throw new InternalServerErrorException(
          `Something went Wrong, could not delete Course with Id ${id}`,
        );
      }
      return {
        message: 'Message deleted successfully',
      };
    } catch (err:any) {
      if (err instanceof HttpException) {
        return err;
      } else {
        return new InternalServerErrorException('Something went Wrong', err);
      }
    }
  }
}
