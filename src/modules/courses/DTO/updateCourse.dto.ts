import { PartialType } from "@nestjs/mapped-types";
import { CreateCourseDto } from "./createCourse.dto";
import { IsString } from 'class-validator';
export class updateCourse extends PartialType(CreateCourseDto){
    @IsString()
    courseId:string
}