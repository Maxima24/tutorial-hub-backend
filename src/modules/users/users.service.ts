import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUserDto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
      private logger= new Logger(UsersService.name)
    constructor(private readonly db:PrismaService,
      
    ){}
    async update(body:{id:string,dto:UpdateUserDto}){
        const {id,dto} = body
        this.logger.debug({
            id,
            dto
        })
        const user  = await this.db.user.findUnique({
            where:{id}
        })
        if(!user){
            throw new NotFoundException("User for the id cannot be found")
        }
        await this.db.user.update({
            where:{
                id
            },
            data:{
                name:dto.name,
                email:dto.email,
                avatarUrl:dto.avatarUrl,
                bio:dto.bio
            }
        })

    }
}
