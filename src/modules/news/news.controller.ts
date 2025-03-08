import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";

@Controller('news')
export class NewsController {
    constructor(
        private newsService: NewsService
    ) { }

    @Get()
    async list() {
        return await this.newsService.list();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.newsService.findOne(id);
    }

    @Post()
    async create(@Body() body: CreateNewsDto) {
        return await this.newsService.create(body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.newsService.delete(id);
    }
}