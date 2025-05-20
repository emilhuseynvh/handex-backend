import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactEntity } from "src/entities/contact.entity";
import { Repository } from "typeorm";
import { CreateContactDto } from "./dto/create-contact.dto";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(ContactEntity)
        private contactRepo: Repository<ContactEntity>
    ) { }

    async list() {
        return await this.contactRepo.find();
    }

    async create(params: CreateContactDto) {
        let contact = this.contactRepo.create(params);

        await contact.save();

        return {
            message: 'Contact created succesfully',
            contact
        };
    }

    async delete(id: number) {
        let result = await this.contactRepo.delete(id);

        if (!result.affected) throw new NotFoundException('Message is not found');

        return {
            message: 'Message deleted succesfully'
        };
    }
}