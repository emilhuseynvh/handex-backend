import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConsultationEntity } from "src/entities/consultation.entity";
import { ConsultationController } from "./consultation.controller";
import { ConsultationService } from "./consultation.service";

@Module({
    imports: [TypeOrmModule.forFeature([ConsultationEntity])],
    controllers: [ConsultationController],
    providers: [ConsultationService]
})
export class ConsultationModule { }