import { IsArray, IsOptional, IsString } from 'class-validator';
import {PartialType} from "@nestjs/mapped-types"

export class CourseCreateDto {
  @IsString()
  courseName!: string;
  @IsString()
  description!: string;
  @IsArray()
  video!: string[];
  @IsOptional()
  @IsArray()
  reviews!: [];
  @IsString()
  userId!:string
}
export class CourseFindDTO{
    @IsString()
    courseId!:string
    

}
export class PartialCourseFindDTO extends PartialType(CourseFindDTO){
        @IsString()
    name!:string
    @IsString()
    author!:string
}