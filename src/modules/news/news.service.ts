import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsEntity } from "src/entities/news.entity";
import { Like, Repository } from "typeorm";
import { UploadService } from "../upload/upload.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { I18nService } from "nestjs-i18n";
import { ClsService } from "nestjs-cls";
import { mapTranslation } from "src/shares/utils/translation.util";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaService } from "../meta/meta.service";
import { UploadEntity } from "src/entities/upload.entity";
import { UpdateNewsDto } from "./dto/update-news.dto";

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

    async list(query: string, page: number = 0) {
        let lang = this.cls.get('lang');

        const searchCondition = {
            translations: {
                lang,
                value: query && Like(`%${query}%`)
            },
            meta: {
                translations: {
                    lang,
                    model: 'meta'
                }
            }
        };

        const [result, total] = await this.newsRepo.findAndCount({
            where: searchCondition,
            take: 12,
            skip: page * 12,
            order: { createdAt: 'DESC' },
            select: {
                id: true,
                createdAt: true,
                slug: true,
                translations: {
                    id: true,
                    field: true,
                    value: true,
                    lang: true,
                },
                image: {
                    id: true,
                    url: true,
                    alt: true
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
            data: result.map(item => {
                return {
                    ...mapTranslation(item),
                    meta: item.meta.map(item => mapTranslation(item))
                };
            }),
            totalPages: Math.ceil(total / 12),
            totalItems: total,
            query: query
        };
    }

    async findOne(slug: string) {
        let lang = this.cls.get('lang');
        let result = await this.newsRepo.findOne({
            where: {
                slug,
                translations: {
                    lang
                },
                meta: {
                    translations: {
                        lang
                    }
                }
            },
            select: {
                id: true,
                createdAt: true,
                slug: true,
                translations: {
                    id: true,
                    field: true,
                    value: true,
                    lang: true,
                },
                image: {
                    id: true,
                    url: true,
                    alt: true
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
        if (!result) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            ...mapTranslation(result),
            meta: result.meta.map(item => mapTranslation(item))
        };
    }

    async create(params: CreateNewsDto) {
        let image = await this.uploadRepo.findOne({ where: { id: params.image } });

        if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        let check = await this.newsRepo.findOne({
            where: { slug: params.slug }
        });

        if (check) {
            throw new ConflictException('Slug is exists');
        }

        let news = this.newsRepo.create({
            image,
            slug: params.slug
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

        let metaArray = [];
        for (let meta of params.meta) {
            let metaTranslations = [];
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
            metaArray.push(this.metaRepo.create({ translations: metaTranslations, news: news.id, slug: 'news' } as any));
        }


        news.translations = translations;
        news.meta = metaArray as any;

        await this.newsRepo.save(news);

        return news;
    }

    async update(id: number, params: UpdateNewsDto) {
        let news = await this.newsRepo.findOne({
            where: { id },
            relations: ['translations', 'image', 'meta', 'meta.translations']
        });

        if (!news) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        if (params.image) {
            const image = await this.uploadRepo.findOne({ where: { id: params.image } });
            if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
            news.image = image;
        }

        if (params.slug) {
            news.slug = params.slug;
        }

        await this.newsRepo.save(news);

        if (params.translations && params.translations.length > 0) {
            const existingTranslations = news.translations || [];

            for (const translation of params.translations) {
                const lang = translation.lang;

                const existingTitleTranslation = existingTranslations.find(
                    t => t.lang === lang && t.field === 'title'
                );

                if (existingTitleTranslation) {
                    existingTitleTranslation.value = translation.title;
                    await this.newsRepo.manager.save(existingTitleTranslation);
                } else {
                    const newTitleTranslation: any = {
                        model: 'news',
                        lang: lang,
                        field: 'title',
                        value: translation.title,
                        entityId: news.id
                    };
                    news.translations.push(newTitleTranslation);
                }

                const existingDescTranslation = existingTranslations.find(
                    t => t.lang === lang && t.field === 'description'
                );

                if (existingDescTranslation) {
                    existingDescTranslation.value = translation.description;
                    await this.newsRepo.manager.save(existingDescTranslation);
                } else {
                    const newDescTranslation: any = {
                        model: 'news',
                        lang: lang,
                        field: 'description',
                        value: translation.description,
                        entityId: news.id
                    };
                    news.translations.push(newDescTranslation);
                }
            }
        }

        if (params.meta && params.meta.length > 0) {
            let meta = news.meta && news.meta.length > 0 ? news.meta[0] : null;

            if (!meta) {
                meta = this.metaRepo.create({ news: news.id, slug: 'news' } as any) as any;
                await this.metaRepo.save(meta);
            }

            for (const metaData of params.meta) {
                console.log(metaData);
                
                for (const translation of metaData.translations) {
                    const lang = translation.lang;

                    if (meta.translations) {
                        const existingNameTrans = meta.translations.find(
                            t => t.lang === lang && t.field === 'name' && t.value === translation.value
                        );

                        if (existingNameTrans) {
                            existingNameTrans.value = translation.name;
                            await this.metaRepo.manager.save(existingNameTrans);
                        } else {
                            const newNameTrans: any = {
                                model: 'meta',
                                lang: lang,
                                field: 'name',
                                value: translation.name,
                                entityId: meta.id
                            };
                            meta.translations.push(newNameTrans);
                        }

                        const existingValueTrans = meta.translations.find(
                            t => t.lang === lang && t.field === 'value'
                        );

                        if (existingValueTrans) {
                            existingValueTrans.value = translation.value;
                            await this.metaRepo.manager.save(existingValueTrans);
                        } else {
                            const newValueTrans: any = {
                                model: 'meta',
                                lang: lang,
                                field: 'value',
                                value: translation.value,
                                entityId: meta.id
                            };
                            meta.translations.push(newValueTrans);
                        }
                    }
                }
            }

            await this.metaRepo.save(meta);
        }

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