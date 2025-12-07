import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './DTO/createCourse.dto';
import { updateCourse } from './DTO/updateCourse.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly db: PrismaService) {}
  async createCourse(data: CreateCourseDto) {
    const { userId } = data;
    const user = await this.db.client.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException(`user with id ${userId} does not exist`);
    }
    const course =await this.db.client.course.create({
      data: {
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        isPublished: data.isPublished,
        userId: data.userId,
        videos: {
          connect: data.videos.map((video) => ({ id: video.id })),
        },
      },
      include: { videos: true },
    });
    if(!course){
        throw new BadRequestException("Failed to create course")
    }
    return course
  }
  async getCourseById(id: string) {
    const course  = await this.db.client.course.findUnique({
        where: { id }
    })
    if(!course){
        throw new BadRequestException(`Course with id ${id} does not exist`)
    }
    return course
  }
  async deleteCourse(id: string) {
    const course  =  await this.db.client.course.findUnique({
        where: { id }
    })
    if(!course){
        throw new BadRequestException(`Course with id ${id} does not exist`)
    }
    return await this.db.client.course.delete({
        where: { id }
    })
  }
  async updateCourseContent(data: updateCourse) {
    const userId  = data.userId;
    const courseId = data.courseId
    const user = await this.db.client.user.findUnique({
      where: { id: userId },
    });
    if(!user){
        throw new BadRequestException(`user with id ${userId} does not exist`)
    }
    const course =  await this.db.client.course.findUnique({
        where: { id: data.userId }
    })
    if(!course){
        throw new BadRequestException(`Course with id ${data.userId} does not exist`)
    }
    return await this.db.client.course.update({

        where: { id:courseId},
        data: {
              title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        isPublished: data.isPublished,
        userId: data.userId,
      ...(data.videos && data.videos.length > 0 && {
        videos: {
          set: [], // Clear existing connections first
          connect: data.videos.map((video) => ({ id: video.id })),
        },
      })         
    }})
  }
}
