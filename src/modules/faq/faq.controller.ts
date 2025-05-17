import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { FaqService } from "./faq.service";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { ApiQuery } from "@nestjs/swagger";

@Controller('faq')
export class FaqController {
    constructor(
        private faqService: FaqService
    ) { }

    @Get()
    @ApiQuery({ name: 'studyArea' })
    async list(@Query('studyArea') studyArea: number) {
        return await this.faqService.list(studyArea);
    }

    @Post()
    async create(@Body() body: CreateFaqDto) {
        return await this.faqService.create(body);
    }

    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateFaqDto) {
        return await this.faqService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.faqService.delete(id);
    }
}