import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConsultationEntity } from "src/entities/consultation.entity";
import { Repository } from "typeorm";
import { CreateConsultationDto } from "./consultation-dto/create-consultation.dto";
import { UpdateConsultationDto } from "./consultation-dto/update-consultation.dto";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class ConsultationService {
    constructor(
        @InjectRepository(ConsultationEntity)
        private consultationRepo: Repository<ConsultationEntity>,
        private i18n: I18nService
    ) { }

    async list() {
        let list = await this.consultationRepo.find();

        return list;
    }

    async create(params: CreateConsultationDto) {
        let result = this.consultationRepo.create(params);

        await this.consultationRepo.save(result);

        return result;
    }

    async deleteCons(id: number) {
        let result = await this.consultationRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return { message: this.i18n.t('response.deleted') };
    }

    // async update(id: number, params: UpdateConsultationDto) {
    //     let consultation = await this.consultationRepo.update(id, params);

    //     if (!consultation.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

    //     return {

    //     };


    // }
}