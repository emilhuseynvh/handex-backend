import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { StatisticsService } from "./statistic.service";
import { CreateStatisticsDto } from "./statistics-dto/create-statistics.dto";
import { UpdateStatisticsDto } from "./statistics-dto/update-statistics.dto";

@Controller('statistics')
export class StatisticsController {
    constructor(
        private statisticService: StatisticsService
    ) { }

    @Get()
    async getStatistics() {
        return await this.statisticService.list()
    }

    @Post()
    create(@Body() body: CreateStatisticsDto) {
        return this.statisticService.create(body)
    }

    @Post(':id')
    update(@Body() body: UpdateStatisticsDto, @Param('id') id: number) {
        return this.statisticService.update(id, body)
    }
}