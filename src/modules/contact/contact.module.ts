import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactEntity } from "src/entities/contact.entity";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";

@Module({
    imports: [TypeOrmModule.forFeature([ContactEntity])],
    controllers: [ContactController],
    providers: [ContactService]
})
export class ContactModule { }