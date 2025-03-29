import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
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

  async uploadImage(file: Express.Multer.File) {
    try {
      const result = await this.cloudinaryService.uploadFile(file);
      if (!result?.url) throw new Error();

      const image = this.imageRepo.create({
        url: result.url,
      });

      await image.save();

      return image;
    } catch (err) {
        console.log(err);
      throw new BadRequestException('Something went wrong');
    }
  }
}
