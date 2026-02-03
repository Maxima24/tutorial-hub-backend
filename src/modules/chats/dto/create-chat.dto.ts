import { ArrayNotEmpty, IsArray, IsString, IsBoolean } from "class-validator";

export class CreateChatDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  participantsId: string[];

  @IsBoolean()
  isGroup?: boolean;
}
