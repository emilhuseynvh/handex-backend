import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewsEntity } from "src/entities/news.entity";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { TranslationsEntity } from "src/entities/translations.entity";
import { UploadService } from "../upload/upload.service";
import { UploadEntity } from "src/entities/upload.entity";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaService } from "../meta/meta.service";

@Module({
    imports: [TypeOrmModule.forFeature([NewsEntity, TranslationsEntity, UploadEntity, MetaEntity])],
    controllers: [NewsController],
    providers: [NewsService, UploadService, MetaService],
})
export class NewsModule { }