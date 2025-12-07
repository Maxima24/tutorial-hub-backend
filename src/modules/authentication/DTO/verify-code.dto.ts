
import { IsString,IsInt, } from "class-validator";
export class VerifyCodeDto {
    @IsString()
  email: string;
  @IsInt()
  code: string;
    @IsString()
  password: string;
    @IsString()
  name: string;
}
