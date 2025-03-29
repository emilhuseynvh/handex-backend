import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ContentEntity } from "src/entities/content.entity";
import { MetaService } from "../meta/meta.service";
import { MetaEntity } from "src/entities/meta.entity";
import { ContentService } from "./content.service";
import { ContentController } from "./content.controller";
import { UploadEntity } from "src/entities/upload.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ContentEntity, TranslationsEntity, MetaEntity, UploadEntity])],
    controllers: [ContentController],
    providers: [ContentService, MetaService],
})
export class ContentModule { }