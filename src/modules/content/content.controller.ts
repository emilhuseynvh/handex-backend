import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AboutService } from "./content.service";
import { CreateAboutDto } from "./content-dto/create-content.dto";
import { DeleteAboutDto } from "./content-dto/delete-content.dto";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";

@Controller('content')
export class AboutController {
    constructor(
        private aboutService: AboutService
    ) { }
    @Get()
    get() {
        return this.aboutService.get();
    }

    @Post()
    create(@Body() body: CreateAboutDto) {
        console.log(body.slug);

        return this.aboutService.create(body);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', description: 'The ID of the about item to delete', required: true })
    deleteAbout(@Param() params: DeleteAboutDto) {
        return this.aboutService.delete(params.id);
    }
}