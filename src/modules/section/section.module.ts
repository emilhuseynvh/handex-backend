import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionEntity } from "src/entities/section.entity";
import { SectionController } from "./section.controller";
import { SectionService } from "./section.service";
import { TranslationsEntity } from "src/entities/translations.entity";
import { AboutEntity } from "src/entities/about.entity";

@Module({
    imports: [TypeOrmModule.forFeature([SectionEntity, TranslationsEntity, AboutEntity])],
    controllers: [SectionController],
    providers: [SectionService]
})
export class SectionModule { }