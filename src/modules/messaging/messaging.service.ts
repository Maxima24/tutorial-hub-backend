import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SendMessageDto } from "./DTO/send-message.dto";
import { ChatsService } from "../chats/chats.service";

@Injectable()
export class MessagingService {
  constructor(
    private readonly prisma: PrismaService,
    private chatService: ChatsService
  ) {}
 
 async sendMessage(senderId: string, dto: SendMessageDto) {
  // 1. Create or get chat
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
    include: { sender: true },
  });

  // 3. Update chat last message
  

  return { message, chatId: chat.id };
}

}
