import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessagingService } from "./messaging.service";
import { SendMessageDto } from "./DTO/send-message.dto";
import { WsJwtGuard } from "./guards/ws-jwt.guard";
import { UseGuards, Logger, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ChatsService } from "./../chats/chats.service";
import { ReplyMessageDto } from "./DTO/reply-message-dto";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MessagingGateway.name);

  constructor(
    private readonly messagingService: MessagingService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly chatService: ChatsService // Add JWT service
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;

    if (!token) {
      this.logger.warn("Client connected without token, disconnecting");
      client.disconnect();
      return;
    }

    try {
      // Verify token and extract user info
      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub || payload.userId;
      this.logger.debug("THis is the required user payload", userId);
      // Store user info in socket
      client.data.userId = userId;
      const chats = await this.chatService
        .getUserChats(userId) // Join user to their own room for targeted messaging
    
    chats.forEach(chat=>{
     client.join(chat.id) 
     return this.logger.debug(`User with id ${userId} is connected to the chat ${chat.id}`)

    })

     
    } catch (err) {
      this.logger.error("Invalid token on connection", err);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      client.leave(`user:${userId}`);
      this.logger.debug(`User ${userId} disconnected`);
    }
  }

@SubscribeMessage("joinChats")
handleJoinChats(
  @ConnectedSocket() client: Socket,
  @MessageBody() chatIds: string[]
) {
  chatIds.forEach((chatId) => {
    client.join(chatId);
    this.logger.debug(`Socket ${client.id} joined chat ${chatId}`);
  });
}


  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto
  ) {
    const token = client.handshake.auth.token;

    if (!token) {
      this.logger.warn("SendMessage: No token provided");
      return { status: "error", message: "Unauthorized" };
    }

    try {
      // Verify token and get sender ID
      const jwtPayload = await this.jwtService.verifyAsync(token);
      this.logger.debug("this is the jwtPayload",jwtPayload)
      const senderId = jwtPayload.sub || jwtPayload.userId;
      this.logger.debug("this is the sender id ", senderId);
      this.logger.debug("this is the payload from the frontend",payload)
      if(!senderId){
        throw new UnauthorizedException("Invalid authentication token")
      }
      // Send message using the verified senderId
      const { message, chatId } = await this.messagingService.sendMessage(
        senderId,
        payload
      );

      // Emit to receiver in real-time
      this.server.to(chatId).emit("receiveMessage", message);
      // return { status: "ok", message };
    } catch (err: any) {
      this.logger.error("Error sending message:", err);
      return { status: "error", message: err.message };
    }
  }

  @SubscribeMessage("replyMessage")
  async handleReplyMessage(
      @ConnectedSocket() client:Socket,
    @MessageBody() payload:ReplyMessageDto
  ){
    const token = client.handshake.auth.token
    if(!token){
        this.logger.warn("SendMessage: No token provided");
      return { status: "error", message: "Unauthorized" };
    }
    const jwtPayload = await this.jwtService.verifyAsync(token)
    const senderId = jwtPayload.sub || jwtPayload.userId
    if(!senderId
    ){
      throw new UnauthorizedException("Invalid authentication token")
    }
   const {reply,chatId} = await this.messagingService.replyMessage(
      senderId,payload
    )
       this.server.to(chatId).emit("receiveReply", reply);
  }
}
 
