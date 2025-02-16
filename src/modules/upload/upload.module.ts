import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadEntity } from 'src/entities/upload.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
    imports: [TypeOrmModule.forFeature([UploadEntity])],
    controllers: [UploadController],
    providers: [UploadService],
})
export class FileModule { }
