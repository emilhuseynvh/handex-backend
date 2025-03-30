import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerController } from "./customers.controller";
import { CustomerService } from "./customer.service";
import { UploadEntity } from "src/entities/upload.entity";
import { TranslationsEntity } from "src/entities/translations.entity";
import { CustomersEntity } from "src/entities/customers.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CustomersEntity, UploadEntity, TranslationsEntity])],
    controllers: [CustomerController],
    providers: [CustomerService]
})
export class CustomersModule{}