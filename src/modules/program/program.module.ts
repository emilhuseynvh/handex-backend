import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgramEntity } from "src/entities/programs.entity";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ProgramController } from "./program.controller";
import { ProgramService } from "./program.service";
import { StudyAreaEntity } from "src/entities/studyArea.entity";
import { UploadEntity } from "src/entities/upload.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProgramEntity, TranslationsEntity, StudyAreaEntity, UploadEntity])],
    controllers: [ProgramController],
    providers: [ProgramService]
})
export class ProgramModule { }