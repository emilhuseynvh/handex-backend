import { Body, Controller, Get, Patch, Post, Put } from "@nestjs/common";
import { GeneralService } from "./general.service";
import { CreateGeneralDto } from "./dto/create-general.dto";
import { UpdateGeneralDto } from "./dto/update-general.dto";
import { Auth } from "src/shares/decorators/auth.decorator";

@Controller('general')
export class GeneralController {
    constructor(
        private generalService: GeneralService
    ) { }
    @Get()
    async list() {
        return await this.generalService.list();
    }

    @Post()
    @Auth()
    async create(@Body() body: CreateGeneralDto) {
        return await this.generalService.create(body);
    }

    @Post('update')
    @Auth()
    async update(@Body() body: UpdateGeneralDto) {
        return await this.generalService.update(body);
    }
}