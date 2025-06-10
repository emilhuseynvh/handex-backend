import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { StatisticService } from "./statistic.service";
import { CreateStatisticDto } from "./dto/create-statistic.dto";
import { UpdateStatisticDto } from "./dto/update-statistic.dto";

@Controller('statistic')
export class StatisticController {
    constructor(
        private statisticService: StatisticService
    ) { }

    @Get()
    async list(@Query('field') field: string) {
        return await this.statisticService.list(field);
    }

    @Post()
    async create(@Body() body: CreateStatisticDto) {
        return await this.statisticService.create(body);
    }

    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateStatisticDto) {
        return await this.statisticService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.statisticService.delete(id);
    }
}