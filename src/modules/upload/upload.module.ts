import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadEntity } from 'src/entities/upload.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';

@Module({
    imports: [TypeOrmModule.forFeature([UploadEntity])],
    controllers: [UploadController],
    providers: [UploadService, CloudinaryService],
})
export class FileModule { }
