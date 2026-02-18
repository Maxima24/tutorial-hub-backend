import { IsString } from "class-validator";

export class UpdateUserDto{
    @IsString()
    name!:string
    @IsString()
    email!:string
    @IsString()
    avatarUrl!:string
    @IsString()
    bio!:string

}