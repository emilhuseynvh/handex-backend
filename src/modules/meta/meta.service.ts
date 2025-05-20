import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaEntity } from "src/entities/meta.entity";
import { Repository } from "typeorm";
import { CreateMetaDto } from "./meta-dto/create-meta.dto";
import { I18nService } from "nestjs-i18n";
import { ClsService } from "nestjs-cls";
import { TranslationsEntity } from "src/entities/translations.entity";
import { faqTranslation, mapTranslation, metaTranslations } from "src/shares/utils/translation.util";
import { UpdateMetaDto } from "./meta-dto/update-meta.dto";

@Injectable()
export class MetaService {
    constructor(
        @InjectRepository(MetaEntity)
        private metaRepo: Repository<MetaEntity>,
        private i18n: I18nService,
        @InjectRepository(TranslationsEntity)
        private translationRepo: Repository<TranslationsEntity>,
        private cls: ClsService
    ) { }

    async list(slug: string) {
        const lang = this.cls.get('lang');

        const checkField: any = await this.metaRepo.find({
            where: {
                translations: { lang },
                slug
            },
            relations: ['translations']
        });

        if (!checkField.length)  throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return checkField.map(item => mapTranslation(item));
    }

    async create(params: CreateMetaDto) {
        let meta = this.metaRepo.create({ slug: params.slug });
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
        }

        await this.translationRepo.save(translations);

        meta.translations = translations;
        await this.metaRepo.save(meta);

        return meta;
    }

    async update(slug: string, params: UpdateMetaDto) {
        let existingMeta = await this.metaRepo.findOne({ where: { slug }, relations: ['translations'] });

        if (!existingMeta) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        const translations: any = [];
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
        }

        console.log(existingMeta);

        const result: any = await Promise.all(translations);
        existingMeta.translations.push(...result);

        await existingMeta.save();

        return {
            ...existingMeta,
            result
        };
    }

    async deleteMeta(id: number) {
        let result = await this.metaRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: this.i18n.t('response.deleted')
        };
    }
}