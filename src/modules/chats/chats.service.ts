import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChatsService {
  private logger = new Logger(ChatsService.name)
  constructor(private readonly db: PrismaService) {}
  async createOrGetChat(createChatDto: CreateChatDto,) {
    const { participantsId,isGroup } = createChatDto;
    // sort array of participants
    if (!isGroup) participantsId.sort();

  const existingChat = await this.db.chat.findFirst({
      where: {
        participants: {
          every: { 
            userId: { 
              in: participantsId } }, // pseudo-concept: match all participants
        },
      },
      include: { participants:{
        select:{
          id:true,
          chatId:true,
          chat:true,
          userId:true,
          user:{
            select:
            {
              id:true,
              name:true,
              email:true,
              verified:true,
              avatarUrl:true
            }
          }
        }
      } },
    });

    if (existingChat) {
      return existingChat;
    }
    const newChat = await this.db.$transaction(async (tx) => {
      const chat = await tx.chat.create({
        data: {},
      });
      for (const userId of participantsId) {
        await tx.chatUser.create({
          data: {
            chatId:chat.id,
            userId,
          },
        });
      }
      return chat;
    });
    return newChat;
  }
 
  async getUserChats(userId: string) {
    const chats = await this.db.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include:{
            replies:{
          orderBy:{createdAt: "asc"}
        }
          }
        },

      },
      orderBy:{updatedAt:"desc"}
    });
    
    this.logger.debug("this are the chats",chats)
    if(!chats) throw new NotFoundException("The chats could not be found ")
   
      return chats
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
