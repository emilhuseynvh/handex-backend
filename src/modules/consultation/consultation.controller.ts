import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ConsultationService } from "./consultation.service";
import { CreateConsultationDto } from "./consultation-dto/create-consultation.dto";
import { UpdateConsultationDto } from "./consultation-dto/update-consultation.dto";

@Controller('consultation')
export class ConsultationController {
    constructor(
        private consultationService: ConsultationService
    ) { }

    @Get()
    async list() {
        return await this.consultationService.list();
    }

    @Post()
    async create(@Body() body: CreateConsultationDto) {
        return await this.consultationService.create(body);
    }


    // @Post(':id')
    // async update(@Param('id') id: number, @Body() body: UpdateConsultationDto) {
    //     return await this.consultationService.update(id, body);
    // }

    @Delete(':id')
    async deleteCons(@Param('id') id: number) {
       return await this.consultationService.deleteCons(id);
    }
}