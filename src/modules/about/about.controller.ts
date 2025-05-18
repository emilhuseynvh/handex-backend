import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AboutService } from "./about.service";
import { CreateAboutPageDto } from "./dto/create-about.dto";
import { UpdateAboutPageDto } from "./dto/update-about.dto";
import { Auth } from "src/shares/decorators/auth.decorator";

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
    @Auth()
    async create(@Body() body: CreateAboutPageDto) {
        return await this.aboutService.create(body);
    }

    @Post('update')
    @Auth()
    async update(@Body() body: UpdateAboutPageDto) {
        return await this.aboutService.update(body);
    }

    @Delete(':id')
    @Auth()
    async delete(@Param('id') id: number) {
        return await this.aboutService.delete(id);
    }
}