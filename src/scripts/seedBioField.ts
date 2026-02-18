import { BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
const logger = new Logger("Seeeder")
async function seedBio()
{
    const db = new PrismaService()
    console.log("Starting to seed the Bio Field")
    const users = await db.user.findMany({})
    for(const user of users){
        const Nuser = await db.user.findUnique({
            where:{
                id:user.id
            }
        })
        if(!Nuser){
            logger.debug("The Request could not be processed")
            continue
        }
        await db.user.update({
             where:{
                id:Nuser.id
             },
             data:{
                bio:"welcome"
             }
        })
        logger.debug("THis has been completed")

    }


}
    seedBio()