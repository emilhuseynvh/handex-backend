import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { ApiQuery } from "@nestjs/swagger";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { Auth } from "src/shares/decorators/auth.decorator";

@Controller('news')
export class NewsController {
    constructor(
        private newsService: NewsService
    ) { }

    @Get()
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'q', required: false })
    async list(@Query('q') q?: string, @Query('page') page?: number) {
        return await this.newsService.list(
            q,
            typeof page !== 'undefined' && page >= 0 ? page : undefined
        );
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        return await this.newsService.findOne(slug);
    }

    @Post()
    @Auth()
    async create(@Body() body: CreateNewsDto) {
        return await this.newsService.create(body);
    }

    @Post(':id')
    @Auth()
    async update(@Param('id') id: number, @Body() body: UpdateNewsDto) {
        return await this.newsService.update(id, body);
    }

    @Delete(':id')
    @Auth()
    async delete(@Param('id') id: number) {
        return await this.newsService.delete(id);
    }
}