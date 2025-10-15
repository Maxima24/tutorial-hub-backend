import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UploadVideoSchema } from './DTO/upload-video.dto';

import { UpdateVideoSchema } from './DTO/update-video.dto';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class VideoService {
    constructor(private readonly prisma:PrismaService){}
    async upload(payload:UploadVideoSchema){
        try{
            const video = await this.prisma.client.video.create({
                data:payload
            })
            if(!video) throw new HttpException("could not upload video",HttpStatus.BAD_REQUEST)
                if (video) return {sucess:true,video}
        }catch(err){
            throw new Error(err) 
        }
    }
    async get(id:string){
        const video = await this.prisma.client.video.findUnique({
            where:{id}
        })
        return {
            success:true,
            message:"video retrieved successfully",
            video
        }
    }
    async getAll(){
        const allVideos = await this.prisma.client.video.findMany()
        return {
            success:true,
            message:"All Vidoes retrieved successfully",
            videos:allVideos
        }
    }
    async update(id:string,updatedField:UpdateVideoSchema){
      const existingVideo = await this.prisma.client.video.findUnique({
        where:{id}
      })
        if(!existingVideo) throw new NotFoundException(`video with ID ${id} not found`)
       const updatedVideo = await this.prisma.client.video.update({
        where:{id},
        data:updatedField
    })  
    if(!updatedVideo) throw new BadRequestException("something went wrong video could not be updated")

        return {
            success:true,
            message:"video successfully updated",
            updatedVideo
        }
    }
    async delete(id:string){
        await this.prisma.client.video.delete({
            where:{id}
        })
        return {
            success:true,
            message:"Video successfully deleted"
        }
    }
}
