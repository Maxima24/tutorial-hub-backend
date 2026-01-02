import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseCreateDto } from './dto/course.create.dto';
// import { updateCourse } from './dto/updateCourse.dto';
import { CourseFindDTO } from './dto/course.create.dto';

@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService:CoursesService){}
    @Post()
    async createCourse(@Body() body:CourseCreateDto){
            return await this.courseService.create(body)
    }
    @Get(":id")
    async getCourseById(@Param() courseId:CourseFindDTO){
        return this.courseService.findCourse(courseId)
    }
    @Delete(":id")
    async deleteCourse(id:string){
        return await this.courseService.delete(id)
    }
    // @Patch(":id")
    // async updateCourseById(@Param() updateCourseDto:updateCourse){
    //     return await this.courseService.updateCourseContent(updateCourseDto)
    // }
    
}
