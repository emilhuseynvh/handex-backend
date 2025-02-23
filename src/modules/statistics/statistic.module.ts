import { Global, Module } from "@nestjs/common";
import { StatisticsController } from "./statistics.controller";
import { StatisticsService } from "./statistic.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatisticsEntity } from "src/entities/statistics.entity";

@Module({
    imports: [TypeOrmModule.forFeature([StatisticsEntity])],
    controllers: [StatisticsController],
    providers: [StatisticsService]

})

export class StatisticModule { }