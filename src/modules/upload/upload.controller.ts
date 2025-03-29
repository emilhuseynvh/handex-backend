import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadImageDto } from './dto/upload.dto';
import { imageFileFilter } from 'src/shares/utils/upload-filter.util';
import { UPLOAD_IMAGE_MAX_SIZE } from 'src/shares/constants/upload.constants';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) { }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: UPLOAD_IMAGE_MAX_SIZE,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }
}
