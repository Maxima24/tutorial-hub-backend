import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {PrismaClient} from "@prisma/client"
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
    
      constructor(private configService: ConfigService) {
    // Always call super first with the DB URL
    super({
      adapter: configService.get<string>('DIRECT_URL'),
    });

    // Hot reload safety (only in development)
    if (process.env.NODE_ENV !== 'production') {
      // @ts-ignore
      if (!(global as any).prisma) {
        // @ts-ignore
        (global as any).prisma = this;
      } else {
        // @ts-ignore
        return (global as any).prisma;
      }
    }
  }
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
    
