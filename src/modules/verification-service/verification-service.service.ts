import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VerificationService {
  constructor(
    private readonly mail: MailerService,
    private readonly db: PrismaService,
  ) {}

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendCode(email: string) {
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
    const name = await this.db.client.user.findFirst({
      where:{email},
      select:{
        name:true
      }
    })
    if(!name) throw new NotFoundException(`User with email ${name} was not found`);
  

    await this.db.client.verificationCode.upsert({
      where: { email },
      update: { code, expiresAt, attempts: 0 },
      create: { email, code, expiresAt, attempts: 0 }
    });

    await this.mail.sendMail({
      to: email,
      subject: "Your Registration Verification Code",
      template: "Verification-code",
      context: {
        name,
        code,
        expirationMinutes: 5,
        currentYear:new Date().getFullYear()
      }
    });

    return {
      message: "Verification code sent to your email",
      email
    };
  }

  async verifyCode(email: string, code: string) {
    const verification = await this.db.client.verificationCode.findUnique({
      where: { email }
    });

    if (!verification) {
      throw new BadRequestException("No verification code found for this email");
    }

    // Check if code has expired
    if (new Date() > verification.expiresAt) {
      await this.db.client.verificationCode.delete({ where: { email } });
      throw new BadRequestException("Verification code has expired");
    }

    // Check attempt limit
    if (verification.attempts >= 5) {
      await this.db.client.verificationCode.delete({ where: { email } });
      throw new BadRequestException("Too many failed attempts. Please request a new code");
    }

    // Check if code matches
    if (verification.code !== code) {
      await this.db.client.verificationCode.update({
        where: { email },
        data: { attempts: verification.attempts + 1 }
      });
      throw new BadRequestException("Invalid verification code");
    }

    // Code is valid, delete it
    await this.db.client.verificationCode.delete({
      where: { email }
    });

    return {
      message: "Verification successful",
      verified: true,
      email
    };
  }

  async resendCode(email: string) {
    const verification = await this.db.client.verificationCode.findUnique({
      where: { email }
    });

    if (verification) {
      const timeSinceCreation = Date.now() - verification.createdAt.getTime();
      const oneMinute = 60 * 1000;

      if (timeSinceCreation < oneMinute) {
        throw new BadRequestException("Please wait before requesting a new code");
      }
    }

    return this.sendCode(email);
  }
  async updateUserVerificationStatus(email:string,verified:boolean){
    const user  = await this.db.client.user.update({
      where:{email},
      data:{
        verified
      }
    })
    if (!user) throw new BadRequestException("User could not be verified");
    return true
  }
}