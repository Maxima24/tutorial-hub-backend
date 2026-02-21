import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SendMessageDto } from "./DTO/send-message.dto";
import { ChatsService } from "../chats/chats.service";
import { ReplyMessageDto } from "./DTO/reply-message-dto";
import { DeleteDto } from "./DTO/delete-message-dto";

@Injectable()
export class MessagingService {
  private logger = new Logger(MessagingService.name)
  constructor(
    private readonly prisma: PrismaService,
    private chatService: ChatsService
  ) {}
 
 async sendMessage(senderId: string, dto: SendMessageDto) {
  // 1. Create or get chat
  this.logger.debug("This is the dto object",dto)
  const chat = await this.chatService.createOrGetChat(
    {
      participantsId: [senderId, dto.reciepientId],
      isGroup:false
    }
   );

  // 2. Create message linked to chat
  const message = await this.prisma.message.create({
    data: {
      content: dto.content,
      senderId,
      chatId: chat.id,
    },
    include: { sender:{
      select:{
        id:true,
        name:true,
        avatarUrl:true
      }
    }
 
  },
    
  });

  // 3. Update chat last message
  

  return { message, chatId: chat.id };
}
async replyMessage(senderId:string,dto:ReplyMessageDto){
  this.logger.debug("This is the Logger object",dto)
  const chat  = await this.chatService.createOrGetChat({
    participantsId:[senderId,dto.reciepientId],
    isGroup:false
  })
  
   const message = await this.prisma.message.findUnique({
    where: {id:dto.messageId},
    include:{
      sender:{
        select:{
          id:true,
          name:true,
          avatarUrl:true
        }
      }
    }
  })
  this.logger.debug("THis is the message object",message)
  const reply = await this.prisma.reply.create({
    data:{
      message:message.content,
      chatId:message.chatId,
      content:dto.content,
      messageId: message.id,
      senderId:senderId
    },  
  })

  return {chatId:chat.id,
    reply

  }
}
async deleteMessage(messageId:string,data:DeleteDto){
    const {type} = data
    if(!messageId){
      throw new BadRequestException("No messageId was passed in")
    }
    if(type === "reply"){
        await this.prisma.message.delete({
          where:{id:messageId}
        })
    }else if(type === "message"){
      await this.prisma.message.delete({
        where:{id:messageId}
      })
    }

}}

