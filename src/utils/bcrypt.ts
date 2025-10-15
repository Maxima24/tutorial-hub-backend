import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt"

@Injectable()
export class BcryptHelper{
    private static readonly SALTS_ROUND=10
    static async hashPassword(password:string):Promise<string>{
        return await bcrypt.hash(password,this.SALTS_ROUND)
    }
    static async comparePassword(plain:string,hash:string):Promise<Boolean>{
        return await bcrypt.compare(plain,hash)
    }
}