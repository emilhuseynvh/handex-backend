import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { Auth } from "src/shares/decorators/auth.decorator";
import { CreateContactDto } from "./dto/create-contact.dto";

@Controller('contact')
export class ContactController {
    constructor(
        private contactService: ContactService
    ) { }

    @Get()
    @Auth()
    async list() {
        return await this.contactService.list();
    }

    @Post()
    async create(@Body() body: CreateContactDto) {
        return await this.contactService.create(body);
    }

    @Delete(':id')
    @Auth()
    async delete(@Param('id') id: number) {
        return await this.contactService.delete(id);
    }
}