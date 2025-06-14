import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { StudyAreaService } from "./studyArea.service";
import { Auth } from "src/shares/decorators/auth.decorator";
import { CreateStudyAreaDto } from "./dto/create-studyArea.dto";
import { UpdateStudyAreaDto } from "./dto/update-studyArea.dto";
import { ApiQuery } from "@nestjs/swagger";

@Controller('study-area')
export class StudyAreaController {
    constructor(
        private studyAreaService: StudyAreaService
    ) { }

    @Get()
    async list(@Query('model') model: string) {
        return await this.studyAreaService.list(model);
    }

    @Get(':slug')
    async listOne(@Param('slug') slug: string) {
        return await this.studyAreaService.listOne(slug);
    }

    @Auth()
    @Post()
    async create(@Body() body: CreateStudyAreaDto) {
        return await this.studyAreaService.create(body);
    }

    @Auth()
    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateStudyAreaDto) {
        return await this.studyAreaService.update(id, body);
    }

    @Auth()
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.studyAreaService.delete(id);
    }
}