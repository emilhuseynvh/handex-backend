import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConsultationEntity } from "src/entities/consultation.entity";
import { ConsultationController } from "./consultation.controller";
import { ConsultationService } from "./consultation.service";
import { StudyAreaEntity } from "src/entities/studyArea.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ConsultationEntity, StudyAreaEntity])],
    controllers: [ConsultationController],
    providers: [ConsultationService]
})
export class ConsultationModule { }