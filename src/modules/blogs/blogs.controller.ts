import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { BlogsService } from "./blogs.service";
import { CreateBlogsDto } from "./dto/create-blogs.dto";
import { UpdateBlogsDto } from "./dto/update-blogs.dto";
import { Auth } from "src/shares/decorators/auth.decorator";

@Controller('blogs')
export class BlogsController {
    constructor(
        private blogsService: BlogsService
    ) { }

    @Get()
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'query', required: false })
    async list(@Query('query') query?: string, @Query('page') page?: number) {
        console.log(query);
        
        return await this.blogsService.list(
            query,
            typeof page !== 'undefined' && page >= 0 ? page : undefined
        );
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        return await this.blogsService.findOne(slug);
    }

    @Post()
    @Auth()
    async create(@Body() body: CreateBlogsDto) {
        return await this.blogsService.create(body);
    }

    @Post(':id')
    @Auth()
    async update(@Param('id') id: number, @Body() body: UpdateBlogsDto) {
        return await this.blogsService.update(id, body);
    }

    @Delete(':id')
    @Auth()
    async delete(@Param('id') id: number) {
        return await this.blogsService.delete(id);
    }
}