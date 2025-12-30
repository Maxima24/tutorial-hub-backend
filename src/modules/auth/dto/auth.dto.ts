import { IsString, MinLength, Matches, IsInt } from "class-validator";
export class LoginDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(8)
  name!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email!: string;
}

export class ResendCodeDto {
  email!: string;
}

export class VerifyCodeDto {
  @IsString()
  email!: string;
  @IsInt()
  code!: string;
  @IsString()
  password!: string;
  @IsString()
  name!: string;
}
