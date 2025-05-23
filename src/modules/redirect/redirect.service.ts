import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RedirectEntity } from "src/entities/redirect.entity";
import { Repository } from "typeorm";
import { CreateRedirectDto } from "./dto/create-redirect.dto";

@Injectable()
export class RedirectService {
    constructor(
        @InjectRepository(RedirectEntity)
        private redirectRepo: Repository<RedirectEntity>
    ) { }

    async findRedirect() {
        const redirect = await this.redirectRepo.find();

        if (redirect) return redirect;

        return { "redirect": null };
    }

    async create(params: CreateRedirectDto) {
        const redirect = this.redirectRepo.create(params);

        return redirect.save();
    }

    async delete(id: number) {
        let result = await this.redirectRepo.delete(id);

        if (!result.affected) throw new NotFoundException('Redirect is not found');

        return { "message": "Redirect deleted succesfully" };
    }
}