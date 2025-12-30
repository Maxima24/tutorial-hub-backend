import { IsOptional, IsString, IsNumber, IsInt } from "class-validator";

export class CreateVideoDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  videoUrl!: string;

  @IsNumber()
  duration!: number;

  @IsString()
  difficulty!: string; // ✅ Missing - required

  @IsString()
  price!: string; // ✅ Missing - required

  @IsString()
  videoPublicId!: string; // ✅ Should be required (no ? in schema)

  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
