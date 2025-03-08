import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadInterceptor } from 'src/shares/interceptors/upload.interceptor';

@Controller('file')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(UploadInterceptor.getInterceptor())
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.create(file);
  }

  @Delete(':id')
  deleteFile(@Param('id') id: number) {
    return this.uploadService.deleteFile(id);
  }
}
