import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TranslationsEntity } from "src/entities/translations.entity";
import { UploadService } from "../upload/upload.service";
import { UploadEntity } from "src/entities/upload.entity";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaService } from "../meta/meta.service";
import { CloudinaryService } from "src/libs/cloudinary/cloudinary.service";
import { BlogsEntity } from "src/entities/blogs.entity";
import { BlogsService } from "./blogs.service";
import { BlogsController } from "./blogs.controller";

@Module({
    imports: [TypeOrmModule.forFeature([BlogsEntity, TranslationsEntity, UploadEntity, MetaEntity])],
    controllers: [BlogsController],
    providers: [BlogsService, UploadService, MetaService, CloudinaryService],
})
export class BlogsModule { }