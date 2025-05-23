import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { UploadService } from "../upload/upload.service";
import { I18nService } from "nestjs-i18n";
import { ClsService } from "nestjs-cls";
import { blogTranslations, faqTranslation, mapTranslation, metaTranslations } from "src/shares/utils/translation.util";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaService } from "../meta/meta.service";
import { UploadEntity } from "src/entities/upload.entity";
import { BlogsEntity } from "src/entities/blogs.entity";
import { CreateBlogsDto } from "./dto/create-blogs.dto";
import { UpdateBlogsDto } from "./dto/update-blogs.dto";

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(BlogsEntity)
        private blogRepo: Repository<BlogsEntity>,

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

        let [result, total] = await this.blogRepo.findAndCount({
            where: searchCondition,
            take: 12,
            skip: page * 12,
            order: { createdAt: 'DESC' },
            select: {
                id: true,
                slug: true,
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
        let result = await this.blogRepo.findOne({
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

    async create(params: CreateBlogsDto) {
        let image = await this.uploadRepo.findOne({ where: { id: params.image } });

        if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        let check = await this.blogRepo.findOne({ where: { slug: params.slug } });

        if (check) throw new ConflictException(`Blog in the ${params.slug} slug is exists`);

        let blogs = this.blogRepo.create({
            image,
            slug: params.slug
        });

        await this.blogRepo.save(blogs);

        let translations = [];

        for (let translation of params.translations) {
            translations.push({
                model: 'blogs',
                lang: translation.lang,
                field: 'title',
                value: translation.title
            });

            translations.push({
                model: 'blogs',
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
            metaArray.push(this.metaRepo.create({ translations: metaTranslations, blogs: blogs.id, slug: 'blogs' } as any));
        }


        blogs.translations = translations;
        blogs.meta = metaArray as any;

        await this.blogRepo.save(blogs);

        return blogs;
    }

    async update(id: number, params: UpdateBlogsDto) {
        let blogs = await this.blogRepo.findOne({
            where: { id },
            relations: ['translations', 'image', 'meta', 'meta.translations']
        });

        if (!blogs) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        if (params.image) {
            const image = await this.uploadRepo.findOne({ where: { id: params.image } });
            if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
            blogs.image = image;
        }

        if (params.slug) {
            blogs.slug = params.slug;
        }

        await this.blogRepo.save(blogs);

        if (params.translations && params.translations.length > 0) {
            const existingTranslations = blogs.translations || [];

            for (const translation of params.translations) {
                const lang = translation.lang;

                const existingTitleTranslation = existingTranslations.find(
                    t => t.lang === lang && t.field === 'title'
                );

                if (existingTitleTranslation) {
                    existingTitleTranslation.value = translation.title;
                    await this.blogRepo.manager.save(existingTitleTranslation);
                } else {
                    const newTitleTranslation: any = {
                        model: 'blogs',
                        lang: lang,
                        field: 'title',
                        value: translation.title,
                        entityId: blogs.id
                    };
                    blogs.translations.push(newTitleTranslation);
                }

                const existingDescTranslation = existingTranslations.find(
                    t => t.lang === lang && t.field === 'description'
                );

                if (existingDescTranslation) {
                    existingDescTranslation.value = translation.description;
                    await this.blogRepo.manager.save(existingDescTranslation);
                } else {
                    const newDescTranslation: any = {
                        model: 'blogs',
                        lang: lang,
                        field: 'description',
                        value: translation.description,
                        entityId: blogs.id
                    };
                    blogs.translations.push(newDescTranslation);
                }
            }
        }

        if (params.meta && params.meta.length > 0) {
            let meta = blogs.meta && blogs.meta.length > 0 ? blogs.meta[0] : null;

            if (!meta) {
                meta = this.metaRepo.create({ blogs: blogs.id, slug: 'blogs' } as any) as any;
                await this.metaRepo.save(meta);
            }

            for (const metaData of params.meta) {
                for (const translation of metaData.translations) {
                    const lang = translation.lang;

                    if (meta.translations) {
                        const existingNameTrans = meta.translations.find(
                            t => t.lang === lang && t.field === 'name'
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

        await this.blogRepo.save(blogs);

        return blogs;
    }

    async delete(id: number) {
        let result = await this.blogRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: this.i18n.t('response.deleted')
        };
    }
}