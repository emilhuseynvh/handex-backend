import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TranslationsEntity } from "src/entities/translations.entity";
import { UploadService } from "../upload/upload.service";
import { UploadEntity } from "src/entities/upload.entity";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaService } from "../meta/meta.service";
import { CloudinaryService } from "src/libs/cloudinary/cloudinary.service";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectEntity } from "src/entities/project.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProjectEntity, TranslationsEntity, UploadEntity, MetaEntity])],
    controllers: [ProjectController],
    providers: [ProjectService, UploadService, MetaService, CloudinaryService],
})
export class ProjectModule { }