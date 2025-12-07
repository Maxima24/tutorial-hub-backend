import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './DTO/createCourse.dto';
import { updateCourse } from './DTO/updateCourse.dto';

@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService:CoursesService){}
    @Post()
    async createCourse(@Body() body:CreateCourseDto){
            return await this.courseService.createCourse(body)
    }
    @Get(":id")
    async getCourseById(@Param() id:string){
        return this.courseService.getCourseById(id)
    }
    @Delete(":id")
    async deleteCourse(id:string){
        return await this.courseService.deleteCourse(id)
    }
    @Patch(":id")
    async updateCourseById(@Param() updateCourseDto:updateCourse){
        return await this.courseService.updateCourseContent(updateCourseDto)
    }
    
}
