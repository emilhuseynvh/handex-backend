import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AboutEntity } from "src/entities/about.entity";
import { SectionEntity } from "src/entities/section.entity";
import { SideEntity } from "src/entities/side.entity";
import { AboutController } from "./about.controller";
import { AboutService } from "./about.service";
import { TranslationsEntity } from "src/entities/translations.entity";
import { SectionService } from "../section/section.service";
import { UploadEntity } from "src/entities/upload.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AboutEntity, SectionEntity, SideEntity, TranslationsEntity, UploadEntity])],
    controllers: [AboutController],
    providers: [AboutService, SectionService]
})
export class AboutModule { }