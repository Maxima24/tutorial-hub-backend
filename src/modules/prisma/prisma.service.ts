import {Injectable,OnModuleDestroy,OnModuleInit} from "@nestjs/common"
import prisma from "../../config/prisma"

@Injectable()
export class PrismaService implements OnModuleDestroy,OnModuleInit{
    async onModuleInit(){
        await prisma.$connect()
        console.log("Prisma connected:Connnected to the database")
    }
    async onModuleDestroy(){
        await prisma.$disconnect()
        console.log("Prisma Disconnected:Disconnected from the Database")
    }
    get client(){
        return prisma
    }
}