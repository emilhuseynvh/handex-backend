import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { Auth } from "src/shares/decorators/auth.decorator";
import { CreateCustomersDto } from "./dto/create-customers.dto";
import { UpdateCustomersDto } from "./dto/update-customers.dto";

@Controller('customers')
export class CustomerController {
    constructor(
        private customersService: CustomerService
    ) { }

    @Get()
    async list() {
        return await this.customersService.list();
    }

    @Auth()
    @Post()
    async create(@Body() body: CreateCustomersDto) {
        return await this.customersService.create(body);
    }

    @Auth()
    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateCustomersDto) {
        return await this.customersService.update(id, body);
    }

    @Auth()
    @Delete(':id')
    async deleteCustomers(@Param('id') id: number) {
        return await this.customersService.delete(id);
    }
}