import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { ProjectService } from "./project.service";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { CreateProjectDto } from "./dto/create-project.dto";

@Controller('project')
export class ProjectController {
    constructor(
        private projectService: ProjectService
    ) { }

    @Get()
    @ApiQuery({ name: 'page', required: false })
    async list(@Query('page') page?: number) {
        return await this.projectService.list(
            typeof page !== 'undefined' && page >= 0 ? page : undefined
        );
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        return await this.projectService.findOne(slug);
    }

    @Post()
    async create(@Body() body: CreateProjectDto) {
        return await this.projectService.create(body);
    }

    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateProjectDto) {
        return await this.projectService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.projectService.delete(id);
    }
}