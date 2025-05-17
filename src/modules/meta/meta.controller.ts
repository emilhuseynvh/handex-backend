import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { MetaService } from "./meta.service";
import { CreateMetaDto } from "./meta-dto/create-meta.dto";
import { ApiQuery } from "@nestjs/swagger";
import { UpdateMetaDto } from "./meta-dto/update-meta.dto";
import { Auth } from "src/shares/decorators/auth.decorator";
import { UserRole } from "src/shares/enums/user.enum";

@Controller('meta')
export class MetaController {
    constructor(
        private metaService: MetaService
    ) { }

    @Get(':field')
    async list(@Param('field') param: string) {
        return await this.metaService.list(param);
    }

    @Auth()
    @Post()
    create(@Body() body: CreateMetaDto) {
        return this.metaService.create(body);
    }

    @Auth()
    @Post(':slug')
    update(@Param('slug') id: string, @Body() body: UpdateMetaDto) {
        return this.metaService.update(id, body);
    }

    @Auth()
    @Delete(':id')
    async deleteMeta(@Param('id') param: number) {
        return await this.metaService.deleteMeta(param);
    }
}