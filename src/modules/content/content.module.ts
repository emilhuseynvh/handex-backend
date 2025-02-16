import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AboutController } from "./content.controller";
import { AboutService } from "./content.service";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ClsService } from "nestjs-cls";
import { I18nService } from "nestjs-i18n";
import { ContentEntity } from "src/entities/content.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ContentEntity, TranslationsEntity])],
    controllers: [AboutController],
    providers: [AboutService]
})
export class AboutModule { }