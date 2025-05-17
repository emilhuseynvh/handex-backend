import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ProgramService } from "./program.service";
import { CreateProgramDto } from "./dto/create-program.dto";
import { ApiQuery } from "@nestjs/swagger";
import { UpdateProgramDto } from "./dto/update-program.dto";

@Controller('program')
export class ProgramController {
    constructor(
        private programService: ProgramService
    ) { }

    @Get()
    @ApiQuery({ name: 'studyArea' })
    async list(@Query('studyArea') studyArea: number) {
        return await this.programService.list(studyArea);
    }

    @Post()
    async create(@Body() body: CreateProgramDto) {
        return await this.programService.create(body);
    }

    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateProgramDto) {
        return await this.programService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.programService.delete(id);
    }
}