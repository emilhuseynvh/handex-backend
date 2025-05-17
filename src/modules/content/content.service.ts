import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { I18nService } from "nestjs-i18n";
import { ContentEntity } from "src/entities/content.entity";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { CreateAboutDto } from "./content-dto/create-content.dto";
import { TranslationsEntity } from "src/entities/translations.entity";
import { mapTranslation } from "src/shares/utils/translation.util";
import { UpdateContentDto } from "./content-dto/update-content.dto";
import { UploadEntity } from "src/entities/upload.entity";

@Injectable()
export class ContentService {
    constructor(
        @InjectRepository(ContentEntity)
        private contentRepo: Repository<ContentEntity>,

        @InjectRepository(TranslationsEntity)
        private translationRepo: Repository<TranslationsEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        private cls: ClsService,
        private i18n: I18nService
    ) { }

    async get(slug: string, query: string) {
        let lang = this.cls.get('lang');

        let queryBuilder = this.contentRepo
            .createQueryBuilder('content')
            .leftJoinAndSelect(
                'content.translations',
                'contentTranslations',
                'contentTranslations.lang = :lang',
                { lang }
            )
            .leftJoinAndSelect('content.images', 'images')
            .where('content.slug = :slug', { slug });

        if (query) {
            queryBuilder.andWhere('contentTranslations.value ILIKE :query', { query: `%${query}%` });
        }

        const result = await queryBuilder.getMany();

        if (!result.length) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return result.map(item => mapTranslation(item));
    }

    async create(params: CreateAboutDto) {
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
        }

        await this.translationRepo.save(translations);

        if (params.images) {
            const images = await this.uploadRepo.findBy({
                id: In(params.images)
            });
            content.images = images;
        }

        content.translations = translations;
        return await this.contentRepo.save(content);
    }

    async update(id: number, params: UpdateContentDto) {
        let existingContent = await this.contentRepo.findOne({
            where: { id },
            relations: ['translations']
        });

        
        if (!existingContent) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
        if (params.images && params.images.length) {
            const images = await this.uploadRepo.findBy({
                id: In(params.images)
            });
            
            existingContent.images = images;
        }

        if (params.translations && params.translations.length) {
            const existingTranslationsMap = new Map();

            if (existingContent.translations?.length) {
                existingContent.translations.forEach(translation => {
                    const key = `${translation.field}_${translation.lang}`;
                    existingTranslationsMap.set(key, translation);
                });
            }

            const updatedTranslations = [];

            for (let translation of params.translations) {
                const titleKey = `title_${translation.lang}`;

                if (existingTranslationsMap.has(titleKey)) {
                    const existingTranslation = existingTranslationsMap.get(titleKey);
                    existingTranslation.value = translation.title;
                    updatedTranslations.push(existingTranslation);
                    existingTranslationsMap.delete(titleKey);
                } else {
                    updatedTranslations.push(this.translationRepo.create({
                        model: 'content',
                        field: 'title',
                        lang: translation.lang,
                        value: translation.title
                    }));
                }
            }

            for (let translation of params.translations) {
                const descKey = `desc_${translation.lang}`;

                if (existingTranslationsMap.has(descKey)) {
                    const existingTranslation = existingTranslationsMap.get(descKey);
                    existingTranslation.value = translation.desc;
                    updatedTranslations.push(existingTranslation);
                    existingTranslationsMap.delete(descKey);
                } else {
                    updatedTranslations.push(this.translationRepo.create({
                        model: 'content',
                        field: 'desc',
                        lang: translation.lang,
                        value: translation.desc
                    }));
                }
            }

            existingTranslationsMap.forEach(translation => {
                updatedTranslations.push(translation);
            });

            await this.translationRepo.save(updatedTranslations);
            existingContent.translations = updatedTranslations;
        }

        let result = await this.contentRepo.save(existingContent);
        return result;
    }

    async delete(id: number) {
        let result = await this.contentRepo.delete(id);
        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: this.i18n.t('response.deleted')
        };
    }

}