import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConsultationEntity } from "src/entities/consultation.entity";
import { Repository } from "typeorm";
import { CreateConsultationDto } from "./consultation-dto/create-consultation.dto";
import { UpdateConsultationDto } from "./consultation-dto/update-consultation.dto";
import { I18nService } from "nestjs-i18n";
import { StudyAreaEntity } from "src/entities/studyArea.entity";

@Injectable()
export class ConsultationService {
    constructor(
        @InjectRepository(ConsultationEntity)
        private consultationRepo: Repository<ConsultationEntity>,

        @InjectRepository(StudyAreaEntity)
        private studyAreaRepo: Repository<StudyAreaEntity>,

        private i18n: I18nService
    ) { }

    async list() {
        return await this.consultationRepo.find({ relations: ['course'] });
    }

    async create(params: CreateConsultationDto) {
        let check = await this.studyAreaRepo.findOne({ where: { id: params.course } });
        if (!check) throw new NotFoundException('Study area is not found');

        let result = this.consultationRepo.create({
            ...params,
            course: { id: params.course },
        });

        await this.consultationRepo.save(result);

        return result;
    }

    async deleteCons(id: number) {
        let result = await this.consultationRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return { message: this.i18n.t('response.deleted') };
    }
}