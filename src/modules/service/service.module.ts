import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TranslationsEntity } from "src/entities/translations.entity";
import { UploadService } from "../upload/upload.service";
import { UploadEntity } from "src/entities/upload.entity";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaService } from "../meta/meta.service";
import { CloudinaryService } from "src/libs/cloudinary/cloudinary.service";
import { ServiceService } from "./service.service";
import { ServiceEntity } from "src/entities/service.entity";
import { ServiceController } from "./service.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ServiceEntity, TranslationsEntity, UploadEntity, MetaEntity])],
    controllers: [ServiceController],
    providers: [ServiceService, UploadService, MetaService, CloudinaryService],
})
export class ServiceModule { }