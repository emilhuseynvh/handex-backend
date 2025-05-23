import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { CreateRedirectDto } from './dto/create-redirect.dto';

@Controller('redirect')
export class RedirectController {
    constructor(private readonly redirectService: RedirectService) { }

    @Get()
    async getRedirect() {
        return await this.redirectService.findRedirect();
    }

    @Post()
    async create(@Body() body: CreateRedirectDto) {
        return await this.redirectService.create(body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.redirectService.delete(id);
    }
}
