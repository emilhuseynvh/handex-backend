import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StatisticsEntity } from "src/entities/statistics.entity";
import { Repository } from "typeorm";
import { CreateStatisticsDto } from "./statistics-dto/create-statistics.dto";
import { UpdateStatisticsDto } from "./statistics-dto/update-statistics.dto";
import { I18nTranslations } from "src/generated/i18n.generated";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(StatisticsEntity)
        private statisticRepo: Repository<StatisticsEntity>,
        private i18n: I18nService<I18nTranslations>
    ) { }

    async list() {
        return await this.statisticRepo.find()
    }

    async create(params: CreateStatisticsDto) {
        let result = this.statisticRepo.create(params)
        return await this.statisticRepo.save(result)
    }

    async update(id: number, params: UpdateStatisticsDto) {
        let statistic = await this.statisticRepo.findOne({ where: { id } })

        if (!statistic) throw new NotFoundException(this.i18n.t('error.errors.not_found'))

        await this.statisticRepo.update({ id }, params)


        return {
            message: "Statistika uğurla yeniləndi!"
        }

    }
}