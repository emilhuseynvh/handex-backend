import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomersEntity } from "src/entities/customers.entity";
import { Repository } from "typeorm";
import { CreateCustomersDto } from "./dto/create-customers.dto";
import { UploadEntity } from "src/entities/upload.entity";
import { I18nService } from "nestjs-i18n";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ClsService } from "nestjs-cls";
import { mapTranslation } from "src/shares/utils/translation.util";
import { UpdateCustomersDto } from "./dto/update-customers.dto";

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(CustomersEntity)
        private customersRepo: Repository<CustomersEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        @InjectRepository(TranslationsEntity)
        private translationsRepo: Repository<TranslationsEntity>,

        private i18n: I18nService,
        private cls: ClsService
    ) { }

    async list() {
        let lang = this.cls.get('lang');
        let result = await this.customersRepo.find({
            where: { translations: { lang } },
            select: {
                id: true,
                bank_name: true,
                name: true,
                translations: true,
                bank_logo: {
                    id: true,
                    url: true
                },
                customer_profile: {
                    id: true,
                    url: true
                }
            },
            relations: ['bank_logo', 'customer_profile', 'translations']
        });

        return result.map(mapTranslation);
    }


    async create(params: CreateCustomersDto) {
        let bankLogo = await this.uploadRepo.findOneBy({ id: params.bank_logo });
        let customer_profile = await this.uploadRepo.findOneBy({ id: params.customer_profile });

        if (!bankLogo || !customer_profile) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        const translationsEntities = params.translations.map(item => {
            return this.translationsRepo.create({
                field: 'comment',
                model: 'customers',
                value: item.comment,
                lang: item.lang
            });
        });

        const customer = this.customersRepo.create({
            name: params.name,
            bank_name: params.bank_name,
            bank_logo: bankLogo,
            customer_profile: customer_profile,
            translations: translationsEntities
        });

        return await customer.save();
    }

    async update(id: number, params: UpdateCustomersDto) {
        const customer = await this.customersRepo.findOne({
            where: { id },
            relations: ['translations', 'bank_logo', 'customer_profile']
        });
        
        if (!customer) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
        
        if (params.bank_logo) {
            const bankLogo = await this.uploadRepo.findOneBy({ id: params.bank_logo });
            if (!bankLogo) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
            customer.bank_logo = bankLogo;
        }
        
        if (params.customer_profile) {
            const customerProfile = await this.uploadRepo.findOneBy({ id: params.customer_profile });
            if (!customerProfile) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
            customer.customer_profile = customerProfile;
        }
        
        if (params.name) customer.name = params.name;
        if (params.bank_name) customer.bank_name = params.bank_name;
        
        if (params.translations && params.translations.length > 0) {
            await this.translationsRepo.remove(customer.translations);
            
            const translationsEntities = params.translations.map(item => {
                return this.translationsRepo.create({
                    field: 'comment',
                    model: 'customers',
                    value: item.comment,
                    lang: item.lang
                });
            });
            
            customer.translations = translationsEntities;
        }
        
        return await customer.save();
    }

    async delete(id: number) {
        let result = await this.customersRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
    }

}