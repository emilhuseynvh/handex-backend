import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatisticEntity } from "src/entities/statistic.entity";
import { TranslationsEntity } from "src/entities/translations.entity";
import { StatisticController } from "./statistic.controller";
import { StatisticService } from "./statistic.service";

@Module({
    imports: [TypeOrmModule.forFeature([StatisticEntity, TranslationsEntity])],
    controllers: [StatisticController],
    providers: [StatisticService]
})
export class StatisticModule { }