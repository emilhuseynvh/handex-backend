import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CreateAboutDto } from "./content-dto/create-content.dto";
import { DeleteAboutDto } from "./content-dto/delete-content.dto";
import { ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger";
import { UpdateContentDto } from "./content-dto/update-content.dto";
import { ContentService } from "./content.service";
import { Auth } from "src/shares/decorators/auth.decorator";

@Controller('content')
export class ContentController {
    constructor(
        private contentService: ContentService
    ) { }

    @Get(':slug')
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Optional search parameter'
      })
    async get(@Param('slug') slug: string, @Query('search') search?: string) {
        return await this.contentService.get(slug, search);
    }

    @Auth()
    @Post()
    create(@Body() body: CreateAboutDto) {
        console.log(body.slug);

        return this.contentService.create(body);
    }

    @Auth()
    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateContentDto) {
        return await this.contentService.update(id, body)
    }

    @Auth()
    @Delete(':id')
    @ApiParam({ name: 'id', description: 'The ID of the about item to delete', required: true })
    deleteAbout(@Param() params: DeleteAboutDto) {
        return this.contentService.delete(params.id);
    }
}