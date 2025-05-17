import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AboutService } from "./about.service";
import { CreateAboutPageDto } from "./dto/create-about.dto";

@Controller('about')
export class AboutController {
    constructor(
        private aboutService: AboutService
    ) { }

    @Get()
    async list() {
        return await this.aboutService.list();
    }

    @Post()
    async create(@Body() body: CreateAboutPageDto) {
        return await this.aboutService.create(body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.aboutService.delete(id);
    }
}