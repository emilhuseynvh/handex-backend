import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { AboutService } from "./content.service";
import { CreateAboutDto } from "./content-dto/create-content.dto";
import { DeleteAboutDto } from "./content-dto/delete-content.dto";
import { ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger";
import { UpdateContentDto } from "./content-dto/update-content.dto";

@Controller('content')
export class AboutController {
    constructor(
        private aboutService: AboutService
    ) { }
    @Get(':slug')
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Optional search parameter'
      })
    async get(@Param('slug') slug: string, @Query('search') search?: string) {
        return await this.aboutService.get(slug, search);
    }

    @Post()
    create(@Body() body: CreateAboutDto) {
        console.log(body.slug);

        return this.aboutService.create(body);
    }

    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateContentDto) {
        return await this.aboutService.update(id, body)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', description: 'The ID of the about item to delete', required: true })
    deleteAbout(@Param() params: DeleteAboutDto) {
        return this.aboutService.delete(params.id);
    }
}