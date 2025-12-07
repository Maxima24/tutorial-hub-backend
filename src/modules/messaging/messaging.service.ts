import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './DTO/send-message.dto';

@Injectable()
export class MessagingService {
    constructor(private readonly prisma:PrismaService){}
    async getMessage(userId:string,otherUserId:string){
        const messages  = await this.prisma.client.message.findMany({
            where:{
                OR:[
                    {senderId:userId,recieverId:otherUserId},
                     {senderId:otherUserId,recieverId:userId}
                ]
            },
            include:{
                sender:true,
                reciever:true
            }
        })
        return messages
    }
    async getReceivedMessages(userId: string) {
    const messages = await this.prisma.client.message.findMany({
      where: { recieverId: userId },
      include: {
        sender: true,
        reciever: true,
      },
      orderBy: {
        createdAt: 'asc',
      } as any,
    });
    return messages;
  }

    async sendMessage(senderId:string,dto:SendMessageDto){
        const message  = await this.prisma.client.message.create({
           data:{
            content:dto.content,
            senderId:senderId,
            recieverId:dto.recieverId
           },
           include:{
            sender:true,
            reciever:true
           }
        })
        return message
    }
}
