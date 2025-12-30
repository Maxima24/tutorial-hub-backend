import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, VerifyCodeDto } from "./dto/auth.dto";
import { ResendCodeDto } from "../verification/dto/resend-code.dto";
import { VerificationService } from "@/modules/verification/verification.service";
import { CurrentUser, JwtAuthGuard } from "@/utils/jwt.strategy";
import { RegisterDto } from "./dto/auth.dto";
import { create } from "domain";
interface AuthUser {
  id: string;
  email: string;
}
@Controller("auth")
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private verificationService: VerificationService
  ) {}

  @Post("register")
  async register(@Body() body: RegisterDto) {
    const { email, name } = body;
    if (Object.values(body).length === 0) {
      throw new BadRequestException("request body cannot be empty");
    }

    const user = await this.authService.register(body);
    this.logger.debug("user created successfully");
    this.logger.debug("Verification service starting ...");

    this.verificationService.sendCode(email);
    return {
      user,
    };
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body() createUserData: LoginDto) {
    this.logger.log("Login attempt received");
    this.logger.debug("Login data:", createUserData);
    if (!createUserData || !createUserData.email || !createUserData.password) {
      throw new BadRequestException(
        `Email and password are required, ${createUserData}`
      );
    }

    console.log("Login attempt for email:", createUserData.email);
    console.log("Request body:", createUserData);
    return this.authService.login(createUserData);
  }
  @Post("verify-code")
  async verifyCode(@Body() verifyCodeData: VerifyCodeDto) {
    const { email, code } = verifyCodeData;
    const { verified } = await this.verificationService.verifyCode(email, code);
    const isVerified =
      await this.verificationService.updateUserVerificationStatus(
        email,
        verified
      );
    if (!isVerified)
      throw new BadRequestException("User could not be verified");
    return {
      status: "success",
      message: "User verified Successfully",
    };
  }
  @Post("resend-code")
  async resendCode(@Body() resendCodeDto: ResendCodeDto) {
    const { email } = resendCodeDto;
    return await this.verificationService.resendCode(email);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getCurrentUsers(@CurrentUser() authUser: AuthUser) {
    return this.authService.findById(authUser.id);
  }
}
