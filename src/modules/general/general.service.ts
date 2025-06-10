import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { GeneralEntity } from "src/entities/general.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateGeneralDto } from "./dto/create-general.dto";
import { UploadEntity } from "src/entities/upload.entity";
import { UpdateGeneralDto } from "./dto/update-general.dto";

@Injectable()
export class GeneralService {
    constructor(
        @InjectRepository(GeneralEntity)
        private generalRepo: Repository<GeneralEntity>,

        private i18n: I18nService
    ) { }

    async list() {
        let result = await this.generalRepo.find({
            select: {
                id: true,
                phone: true,
                location: true,
                email: true,
                company: {
                    id: true,
                    url: true
                }
            },
            relations: ['company']
        });

        if (!result.length) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return result;
    }

    async create(params: CreateGeneralDto) {
        let check = await this.generalRepo.find();

        if (check.length) throw new ConflictException(this.i18n.t('error.errors.conflict'));

        let result = this.generalRepo.create({
            ...params,
            company: params.company?.map(id => ({ id }) as DeepPartial<UploadEntity>)
        });
        return await this.generalRepo.save(result);
    }

    async update(params: UpdateGeneralDto) {
        const check = await this.generalRepo.find({
            relations: ['company']
        });

        let entity = check[0];

        if (!check.length) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        if (params.phone) entity.phone = params.phone;
        if (params.email) entity.email = params.email;
        if (params.location) entity.location = params.location;

        if (params.company !== undefined) {
            entity.company = params.company.map(id => ({ id } as UploadEntity));
        }

        const result = await this.generalRepo.save(entity);

        return {
            message: 'Uğurla yeniləndi',
            result
        };
    }

}