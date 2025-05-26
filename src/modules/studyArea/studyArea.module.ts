import { Module } from "@nestjs/common";
import { StudyAreaService } from "./studyArea.service";
import { StudyAreaController } from "./studyArea.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudyAreaEntity } from "src/entities/studyArea.entity";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ProgramEntity } from "src/entities/programs.entity";
import { UploadEntity } from "src/entities/upload.entity";
import { MetaEntity } from "src/entities/meta.entity";
import { FaqEntity } from "src/entities/faq.entity";
import { GroupService } from "../group/group.service";
import { GroupEntity } from "src/entities/group.entity";

@Module({
    imports: [TypeOrmModule.forFeature([StudyAreaEntity, TranslationsEntity, GroupEntity, ProgramEntity, FaqEntity, UploadEntity, MetaEntity])],
    controllers: [StudyAreaController],
    providers: [StudyAreaService]
})
export class StudyAreaModule { }