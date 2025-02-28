import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { I18nService } from "nestjs-i18n";
import { ContentEntity } from "src/entities/content.entity";
import { I18nTranslations } from "src/generated/i18n.generated";
import { Repository } from "typeorm";
import { CreateAboutDto } from "./content-dto/create-content.dto";
import { TranslationsEntity } from "src/entities/translations.entity";
import { mapTranslation } from "src/shares/utils/translation.util";
import { MetaService } from "../meta/meta.service";

@Injectable()
export class AboutService {
    constructor(
        @InjectRepository(ContentEntity)
        private contentRepo: Repository<ContentEntity>,

        @InjectRepository(TranslationsEntity)
        private translationRepo: Repository<TranslationsEntity>,


        private metaService: MetaService,

        private cls: ClsService,
        private i18n: I18nService<I18nTranslations>
    ) { }

    async get(slug: string) {
        let lang = this.cls.get('lang');
        console.log(slug);

        const result = await this.contentRepo.find({
            where: {
                slug: slug,
            },
            relations: ['translations', 'meta.translations']
        });

        if (!result.length) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return result.map(item => ({
            ...mapTranslation(item),
            meta: item.meta.map(meta => mapTranslation(meta))
        }));
    }

    async create(params: CreateAboutDto) {

        let checkSlug = await this.contentRepo.findOne({ where: { slug: params.slug } });

        if (checkSlug) throw new ConflictException(this.i18n.t('error.errors.conflict'));


        let content = this.contentRepo.create({ slug: params.slug });
        content = await this.contentRepo.save(content);

        let translations: TranslationsEntity[] = [];

        for (let translation of params.translations) {

            translations.push(this.translationRepo.create({
                model: 'content',
                field: 'title',
                lang: translation.lang,
                value: translation.title
            }));

            translations.push(this.translationRepo.create({
                model: 'content',
                field: 'desc',
                lang: translation.lang,
                value: translation.desc
            }));

            await this.translationRepo.save(translations);
        }

        let meta = await this.metaService.create({ ...params.meta[0], content: content.id });

        content.translations = translations;
        content.meta = [meta];
        return await this.contentRepo.save(content);
    }

    async delete(id: number) {
        let result = await this.contentRepo.delete(id);
        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
    }

}