import { Module } from "@nestjs/common";
import { StudyAreaService } from "./studyArea.service";
import { StudyAreaController } from "./studyArea.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudyAreaEntity } from "src/entities/studyArea.entity";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ProgramEntity } from "src/entities/programs.entity";
import { UploadEntity } from "src/entities/upload.entity";

@Module({
    imports: [TypeOrmModule.forFeature([StudyAreaEntity, TranslationsEntity, ProgramEntity, UploadEntity])],
    controllers: [StudyAreaController],
    providers: [StudyAreaService]
})
export class StudyAreaModule { }