import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import config from 'src/config';
import { UploadEntity } from 'src/entities/upload.entity';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UploadService {
  private imageRepo: Repository<UploadEntity>;

  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectDataSource() private dataSoruce: DataSource,
  ) {
    this.imageRepo = this.dataSoruce.getRepository(UploadEntity);
  }

  async saveFile(file: Express.Multer.File, alt: string) {
    let result = this.imageRepo.create({
      url: config.url + '/' + file.path,
      alt
    });

    await result.save();

    return result;
  }

  async saveFiles(files: Express.Multer.File[]) {
    return files.map(file => ({
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
    }));
  }
}
