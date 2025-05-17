import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FaqEntity } from "src/entities/faq.entity";
import { TranslationsEntity } from "src/entities/translations.entity";
import { FaqController } from "./faq.controller";
import { FaqService } from "./faq.service";
import { StudyAreaEntity } from "src/entities/studyArea.entity";

@Module({
    imports: [TypeOrmModule.forFeature([FaqEntity, TranslationsEntity, StudyAreaEntity])],
    controllers: [FaqController],
    providers: [FaqService]
})
export class FaqModule { }