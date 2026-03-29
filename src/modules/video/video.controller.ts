import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { CreateVideoDto } from "./dto/create-video.dto";

@Controller("video")
export class VideoController {
  private logger = new Logger(VideoController.name);
  constructor(private readonly videoService: VideoService) {}
  @Post("create")
  async create(@Body() body: CreateVideoDto) {
    this.logger.debug(body);
    return await this.videoService.create(body);
  }
  @Get(":id")
  async findById(@Param("id") id: string) {
    return await this.videoService.findById(id);
  }
  @Get("")
  async findAll(){
    return await this.videoService.findAllVideos()
  }
  @Delete(":id")
  async deleteById(@Param() id: string) {
    return await this.videoService.delete(id);
  }
}
