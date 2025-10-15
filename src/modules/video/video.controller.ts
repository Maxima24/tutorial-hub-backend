import { Controller,Post,Get,Body,Query, HttpException, HttpStatus, Param, Patch, Delete } from '@nestjs/common';
import { VideoService } from './video.service';
import { UploadVideoSchema } from './DTO/upload-video.dto';
import { UpdateVideoSchema } from './DTO/update-video.dto';

@Controller('video')
export class VideoController {
    constructor(private readonly videoService:VideoService){}
    @Post("video")
    async uploadVideo(@Body() body:UploadVideoSchema){
        try{
            return await this.videoService.upload(body)
        }catch(err){
            throw new HttpException("something went wrong",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Get(":id")
    async getVideo(@Param('id') id :string){
        try{
            return await this.videoService.get(id)
        }catch(err){
            throw new HttpException("something went wrong",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Get()
    async getAllVideos(){
        return await this.videoService.getAll()
    }
    @Patch(":id")
    async updateVid(@Param("id")id:string ,@Body() videoDetails:UpdateVideoSchema ){
        return await this.videoService.update(id,videoDetails)
    }
    @Delete(":id")
    async deleteVideo(@Param("id") id:string){
        return await this.videoService.delete(id)
    }
}
