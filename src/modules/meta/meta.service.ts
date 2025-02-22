import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaEntity } from "src/entities/meta.entity";
import { Repository } from "typeorm";
import { CreateMetaDto } from "./meta-dto/create-meta.dto";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "src/generated/i18n.generated";
import { ClsService } from "nestjs-cls";
import { ContentEntity } from "src/entities/content.entity";
import { TranslationsEntity } from "src/entities/translations.entity";
import { mapTranslation } from "src/shares/utils/translation.util";

@Injectable()
export class MetaService {
    constructor(
        @InjectRepository(MetaEntity)
        private metaRepo: Repository<MetaEntity>,
        private i18n: I18nService<I18nTranslations>,
        @InjectRepository(TranslationsEntity)
        private translationRepo: Repository<TranslationsEntity>,
        private cls: ClsService
    ) { }

    async list(field: string) {

        const lang = this.cls.get('lang');

        const checkField = await this.metaRepo.find({
            where: {
                content: { slug: field },
                translations: { lang }
            },
            relations: ['translations']
        });

        if (!checkField.length) {
            throw new NotFoundException(this.i18n.t('error.errors.not_found'));
        }

        return checkField.map(item => mapTranslation(item));
    }

    async create(params: CreateMetaDto) {
        let meta = this.metaRepo.create({ content: params.content });
        await this.metaRepo.save(meta);

        let translations: TranslationsEntity[] = [];

        for (let translation of params.translations) {
            translations.push(this.translationRepo.create({
                model: 'meta',
                field: 'value',
                lang: translation.lang,
                value: translation.value,
            }));

            translations.push(this.translationRepo.create({
                model: 'meta',
                field: 'name',
                lang: translation.lang,
                value: translation.name,
            }));



            await this.translationRepo.save(translations);
        }
        meta.translations = translations;

         await this.metaRepo.save(meta);

         return meta
    }

    async deleteMeta(id: number) {
        let result = await this.metaRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: this.i18n.t('response.deleted')
        };
    }
}