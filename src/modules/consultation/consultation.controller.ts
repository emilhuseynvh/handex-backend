import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ConsultationService } from "./consultation.service";
import { CreateConsultationDto } from "./consultation-dto/create-consultation.dto";
import { UpdateConsultationDto } from "./consultation-dto/update-consultation.dto";
import { Auth } from "src/shares/decorators/auth.decorator";

@Controller('consultation')
export class ConsultationController {
    constructor(
        private consultationService: ConsultationService
    ) { }

    @Get()
    @Auth()
    async list() {
        return await this.consultationService.list();
    }

    @Post()
    async create(@Body() body: CreateConsultationDto) {
        return await this.consultationService.create(body);
    }

    @Delete(':id')
    @Auth()
    async deleteCons(@Param('id') id: number) {
        return await this.consultationService.deleteCons(id);
    }
}