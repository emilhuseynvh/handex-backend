import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AboutController } from "./content.controller";
import { AboutService } from "./content.service";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ContentEntity } from "src/entities/content.entity";
import { MetaService } from "../meta/meta.service";
import { MetaEntity } from "src/entities/meta.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ContentEntity, TranslationsEntity, MetaEntity])],
    controllers: [AboutController],
    providers: [AboutService, MetaService],
})
export class AboutModule { }