import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsEntity } from "src/entities/news.entity";
import { Repository } from "typeorm";
import { UploadService } from "../upload/upload.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { I18nService } from "nestjs-i18n";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ClsService } from "nestjs-cls";
import { mapTranslation } from "src/shares/utils/translation.util";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaService } from "../meta/meta.service";
import { UploadEntity } from "src/entities/upload.entity";

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(NewsEntity)
        private newsRepo: Repository<NewsEntity>,

        @InjectRepository(MetaEntity)
        private metaRepo: Repository<MetaEntity>,

        private cls: ClsService,

        private metaService: MetaService,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        private uploadService: UploadService,
        private i18n: I18nService
    ) { }

    async list(page: number = 0) {
        let lang = this.cls.get('lang');
        const [result, total] = await this.newsRepo.findAndCount({
            where: {
                translations: { lang },
                meta: { translations: { lang, model: 'meta' } }
            },
            take: 12,
            skip: page * 12,
            order: { createdAt: 'DESC' },
            select: {
                id: true,
                createdAt: true,
                translations: {
                    id: true,
                    field: true,
                    value: true,
                    lang: true,
                },
                image: {
                    id: true,
                    url: true
                },
                meta: {
                    id: true,
                    translations: {
                        id: true,
                        lang: true,
                        value: true,
                        field: true,
                    }
                }
            },
            relations: ['translations', 'image', 'meta', 'meta.translations']
        });

        return {
            data: result.map(item => mapTranslation(item)),
            currentPage: page,
            totalPages: Math.ceil(total / 12),
            totalItems: total,
        };
    }

    async findOne(id: number) {
        let lang = this.cls.get('lang');
        let result = await this.newsRepo.findOne({
            where: {
                id,
                translations: {
                    lang
                }
            },
            select: {
                id: true,
                createdAt: true,
                translations: {
                    id: true,
                    field: true,
                    value: true,
                    lang: true,
                },
                image: {
                    id: true,
                    url: true
                }
            },
            relations: ['translations', 'image']
        });

        return mapTranslation(result);
    }

    async create(params: CreateNewsDto) {
        let image = await this.uploadRepo.findOne({ where: { id: params.image } });

        if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        let news = this.newsRepo.create({
            image,
        });

        await this.newsRepo.save(news);

        let translations = [];

        for (let translation of params.translations) {
            translations.push({
                model: 'news',
                lang: translation.lang,
                field: 'title',
                value: translation.title
            });

            translations.push({
                model: 'news',
                lang: translation.lang,
                field: 'description',
                value: translation.description
            });
        }

        let metaTranslations = [];

        for (let meta of params.meta) {
            meta.translations.forEach((translation) => {
                metaTranslations.push({
                    model: 'meta',
                    field: 'name',
                    lang: translation.lang,
                    value: translation.name,
                });
                metaTranslations.push({
                    model: 'meta',
                    field: 'value',
                    lang: translation.lang,
                    value: translation.value,
                });
            });
        }

        let meta = await this.metaService.create({ translations: metaTranslations, news: news.id });

        news.translations = translations;
        news.meta = [meta];

        console.log(news);


        await this.newsRepo.save(news);

        return news;
    }

    async delete(id: number) {
        let result = await this.newsRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: this.i18n.t('response.deleted')
        };
    }
}