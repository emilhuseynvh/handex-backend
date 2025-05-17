import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServiceService } from "./service.service";
import { CreateServiceDto } from "./dto/create-service.dto";

@Controller('service')
export class ServiceController {
    constructor(
        private serviceService: ServiceService
    ) { }

    @Get()
    @ApiQuery({ name: 'page', required: false })
    async list(@Query('page') page?: number) {
        return await this.serviceService.list(
            typeof page !== 'undefined' && page >= 0 ? page : undefined
        );
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        return await this.serviceService.findOne(slug);
    }

    @Post()
    async create(@Body() body: CreateServiceDto) {
        return await this.serviceService.create(body);
    }

    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateServiceDto) {
        return await this.serviceService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.serviceService.delete(id);
    }
}