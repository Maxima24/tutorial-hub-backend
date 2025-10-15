import { IsInt, IsString } from 'class-validator';


export class UploadVideoSchema {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  url: string;
  @IsString()
  thumbnail: string;
  @IsInt()
  duration:number;
  @IsString()
  userId: string;
  @IsString()
  category:string
  @IsString()
  thumbnailUrl:string
}
