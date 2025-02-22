import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { MetaService } from "./meta.service";
import { CreateMetaDto } from "./meta-dto/create-meta.dto";

@Controller('meta')
export class MetaController {
    constructor(
        private metaService: MetaService
    ) { }

    @Get(':field')
    async list(@Param('field') param: string) {
        return await this.metaService.list(param);
    }

    @Post()
    create(@Body() body: CreateMetaDto) {
        return this.metaService.create(body);
    }

    @Delete(':id')
    async deleteMeta(@Param('id') param: number) {
        return await this.metaService.deleteMeta(param);
    }
}