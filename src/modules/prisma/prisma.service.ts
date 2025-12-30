import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {PrismaClient} from "@prisma/client"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
        async onModuleInit() {
            await this.$connect()
        }
        async onModuleDestroy() {
            await this.$disconnect()
        }
        async checkHealth(){
            const start = Date.now()
                try{
                    await this.$queryRaw`SELECT 1;`
                    return {
                        service:"prisma",
                        status:"up",
                        message:"Prisma is up",
                        duration:Date.now()
                    }
                }catch(error){
                    return {
                        service:"prisma",
                        status:"down",
                        message:"Prisma is down",
                        duration:Date.now()
                    }
                }
        }
    }
    
