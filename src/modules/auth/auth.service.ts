import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';


import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from "bcrypt"
import { PrismaService } from '@/modules/prisma/prisma.service';
import { config } from 'process';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  private readonly logger  = new Logger(AuthService.name)
  constructor(private readonly db: PrismaService,
    private readonly jwt:JwtService,
    private readonly configService:ConfigService
  ) {}
  async register(data: RegisterDto) {
   
    try {
      const { name, password, email } = data;
      const existingUser = await this.db.user.findUnique({where:{email}});
      if (existingUser){
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } 
      const hashed_password = await bcrypt.hash(password, 10);
      this.logger.debug("User creation creation started")
      const user = await this.db.user.create({
        data:{
          
          name,email,password:hashed_password
        }
      });
      const payload = { email:email, sub:( user.id)
       };
       this.logger.log("USer created succesfully")
      const access_token = this.jwt.sign(payload);
      const refresh_token = this.jwt.sign(payload,{
        secret:this.configService.get("JWT_SECRET")!,
        expiresIn: '7d', 

      })
      return {
        access_token,
        refresh_token,
        user: {
          id: user?.id,
          email: user?.email,
          name: user?.name,
        },
        message: 'User created successfully',
      };
    } catch (error) {
      if(error instanceof HttpException){
        return error
      }
      else throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async login(data:LoginDto){
    const {email,password:userPassword} = data
    const user  = await this.db.user.findUnique({
      where:{email},
      omit:{
        createdAt:true,
        updatedAt:true
      }
    })
      const {password,...safeUser} = user
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(userPassword,password)
        if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {email:email,sub:user.id}
     const access_token  = this.jwt.sign(payload)
        const refresh_token = this.jwt.sign(payload,{
        secret:this.configService.get("JWT_SECRET")!,
        expiresIn: '7d', 
      })
    
    return {
      safeUser,
      access_token,
      refresh_token,
      id:user.id,
     message:"User Logged in successfully"
    }
  }
  async validateUser(userId:string){
    await this.db.user.findFirst({
      where:{id:userId}
    })
  }
  async findById(userId:string){
    try{
        
    const user  = await this.db.user.findFirst({
      where:{id:userId},
      omit:{password:true}
    })
    if(!user) return new BadRequestException("User for Particular id not found")
      return user
    }catch(err){
      return new InternalServerErrorException("Something went Wrong")
    

  }
}
}
