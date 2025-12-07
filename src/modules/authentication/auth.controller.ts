import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyCodeDto } from './DTO/verify-code.dto';
import { ResendCodeDto } from './DTO/resend-code.dto';
import { VerificationService } from '../verification-service/verification-service.service';
import { CurrentUser, JwtAuthGuard } from 'src/utils/jwt.strategy';
import { RegisterDTO } from './DTO/register.dto';
interface AuthUser{
  id:string,
  email:string
}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,private verificationService:VerificationService) {}

  @Post('register')
  async register(@Body()  body: RegisterDTO) {
    const {email} =body
    const user= await this.authService.register(body)
    await this.verificationService.sendCode(email);
    return {
      user
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }
  @Post("verify-code")
async verifyCode( @Body() verifyCodeData:VerifyCodeDto){
  const {email,code} = verifyCodeData
  const {verified} = await this.verificationService.verifyCode(email,code)
 const isVerified = await this.verificationService.updateUserVerificationStatus(email,verified)
 if(!isVerified) throw new BadRequestException("User could not be verified");
 return {
  status:"success",
  message:"User verified Successfully"
 }
 
}
@Post("resend-code")
async resendCode(@Body() resendCodeDto:ResendCodeDto){
  const {email} = resendCodeDto
  return await this.verificationService.resendCode(email)
}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUsers(@CurrentUser() authUser:AuthUser){
    return this.authService.findById(authUser.id)
  }
}

