import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { DeleteDto } from "../messaging/DTO/delete-message-dto";
import { MessagingService } from "../messaging/messaging.service";

@Controller("chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService,
    private readonly messagingService:MessagingService
  ) {}

  @Post()
  createorGetChat(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.createOrGetChat(createChatDto);
  }

  @Get("getChats")
  getUserChats(@Query("userId") userId: string) {
    return this.chatsService.getUserChats(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.chatsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(+id, updateChatDto);
  }
  @Delete("message/:id")
  deleteMessage(@Param('id') id:string,@Body() deleteDtoData:DeleteDto){
    return this.messagingService.deleteMessage(id,deleteDtoData)
}
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.chatsService.remove(+id);
  }
}
