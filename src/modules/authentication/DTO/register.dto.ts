import {isString,IsString,MinLength,MaxLength,Matches} from "class-validator"
export class RegisterDTO{
    @IsString()
    @MinLength(8)
    name:string

    @IsString()
    @MinLength(8)
    password:string
    
    @IsString()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    email:string 
}