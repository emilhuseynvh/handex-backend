import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { SectionService } from "./section.service";
import { CreateSectionDto } from "../about/dto/create-about.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";

@Controller('section')
export class SectionController {
    constructor(
        private sectionService: SectionService
    ) { }

    @Get()
    async list() {
        return await this.sectionService.list();
    }

    @Post()
    async create(@Body() body: CreateSectionDto) {
        return await this.sectionService.create(body);
    }

    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateSectionDto) {
        return await this.sectionService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.sectionService.delete(id);
    }
}