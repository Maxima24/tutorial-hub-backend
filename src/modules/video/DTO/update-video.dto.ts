import { PartialType } from '@nestjs/mapped-types';
import { UploadVideoSchema } from './upload-video.dto';

export class UpdateVideoSchema extends PartialType(UploadVideoSchema) {}
