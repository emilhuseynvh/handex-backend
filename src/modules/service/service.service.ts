import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UploadService } from "../upload/upload.service";
import { I18nService } from "nestjs-i18n";
import { ClsService } from "nestjs-cls";
import { mapTranslation } from "src/shares/utils/translation.util";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaService } from "../meta/meta.service";
import { UploadEntity } from "src/entities/upload.entity";
import { ServiceEntity } from "src/entities/service.entity";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { TranslationsEntity } from "src/entities/translations.entity";

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(ServiceEntity)
        private serviceRepo: Repository<ServiceEntity>,

        @InjectRepository(MetaEntity)
        private metaRepo: Repository<MetaEntity>,

        @InjectRepository(TranslationsEntity)
        private translationsRepo: Repository<TranslationsEntity>,

        private cls: ClsService,

        private metaService: MetaService,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        private uploadService: UploadService,
        private i18n: I18nService
    ) { }

    async list(page: number = 0) {
        let lang = this.cls.get('lang');

        let [result, total] = await this.serviceRepo.findAndCount({
            where: {
                translations: { lang },
                meta: { translations: { lang, model: 'meta' } }
            },
            take: 8,
            skip: page * 8,
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
        };
    }

    async findOne(slug: string) {
        let lang = this.cls.get('lang');
        let result = await this.serviceRepo.findOne({
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

    async create(params: CreateServiceDto) {
        let image = await this.uploadRepo.findOne({ where: { id: params.image } });

        if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        let service = this.serviceRepo.create({
            image,
            slug: params.slug
        });

        let check = await this.serviceRepo.findOne({ where: { slug: params.slug } });

        if (check) throw new ConflictException(`Blog in the ${params.slug} slug is exists`);

        await this.serviceRepo.save(service);

        let translations = [];
        for (let translation of params.translations) {
            translations.push({
                model: 'service',
                lang: translation.lang,
                field: 'title',
                value: translation.title
            });

            translations.push({
                model: 'service',
                lang: translation.lang,
                field: 'description',
                value: translation.description
            });
        }

        let metaArray = [];
        for (let meta of params.meta) {
            let metaTranslations = [];
            meta.translations.forEach((translation) => {
                console.log(translation.name);

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
            metaArray.push(this.metaRepo.create({ translations: metaTranslations, service: service.id, slug: 'service' } as any));
        }


        service.translations = translations;
        service.meta = metaArray as any;

        await this.serviceRepo.save(service);

        return service;
    }

    async update(id: number, params: UpdateServiceDto) {
        let service = await this.serviceRepo.findOne({
            where: { id },
            relations: ['translations', 'image', 'meta', 'meta.translations']
        });

        if (!service) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        if (params.image) {
            const image = await this.uploadRepo.findOne({ where: { id: params.image } });
            if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
            service.image = image;
        }

        if (params.slug) {
            service.slug = params.slug;
        }

        await this.serviceRepo.save(service);

        if (params.translations && params.translations.length > 0) {
            const existingTranslations = service.translations || [];

            for (const translation of params.translations) {
                const lang = translation.lang;

                const existingTitleTranslation = existingTranslations.find(
                    t => t.lang === lang && t.field === 'title'
                );

                if (existingTitleTranslation) {
                    existingTitleTranslation.value = translation.title;
                    await this.serviceRepo.manager.save(existingTitleTranslation);
                } else {
                    const newTitleTranslation: any = {
                        model: 'service',
                        lang: lang,
                        field: 'title',
                        value: translation.title,
                        entityId: service.id
                    };
                    service.translations.push(newTitleTranslation);
                }

                const existingDescTranslation = existingTranslations.find(
                    t => t.lang === lang && t.field === 'description'
                );

                if (existingDescTranslation) {
                    existingDescTranslation.value = translation.description;
                    await this.serviceRepo.manager.save(existingDescTranslation);
                } else {
                    const newDescTranslation: any = {
                        model: 'service',
                        lang: lang,
                        field: 'description',
                        value: translation.description,
                        entityId: service.id
                    };
                    service.translations.push(newDescTranslation);
                }
            }
        }

        if (params.meta && params.meta.length > 0) {
            let meta = service.meta && service.meta.length > 0 ? service.meta[0] : null;

            if (!meta) {
                meta = this.metaRepo.create({ service: service.id, slug: 'service' } as any) as any;
                await this.metaRepo.save(meta);
            }

            const existingTranslations: any = [];
            for (let elem of service.meta) {
                for (let t of elem.translations) {
                    existingTranslations.push(t);
                }
            }
            const newTranslations: any = [];

            for (const metaData of params.meta) {
                for (const translation of metaData.translations) {
                    const lang = translation.lang;

                    const existingNameTrans = existingTranslations.find(
                        t => t.lang === translation.lang && t.field === 'name' && t.value === translation.name
                    );

                    if (!existingNameTrans) {
                        let newTranslations = [];
                        newTranslations.push(this.translationsRepo.create({
                            model: 'meta',
                            lang: lang,
                            field: 'name',
                            value: translation.name
                        }));

                        newTranslations.push(this.translationsRepo.create({
                            model: 'meta',
                            lang: lang,
                            field: 'value',
                            value: translation.value
                        }));
                        let newMeta = this.metaRepo.create({ translations: newTranslations, slug: 'service', service: { id: service.id } });
                        await this.metaRepo.save(newMeta);
                        service.meta.push(newMeta);

                    } else {
                        const existingNameTransIndex = service.meta.findIndex(item => item.translations.find(t => t.lang === lang && t.field === 'name' && t.value === translation.name) && item.translations.find(t => t.lang === lang && t.field === 'value'));
                        let existingValueTrans = service.meta[existingNameTransIndex].translations.find(t => t.field === 'value');

                        if (existingValueTrans) {
                            existingValueTrans.value = translation.value;
                            await this.translationsRepo.save(existingValueTrans);
                        } else {
                            const existingNameTransIndex = service.meta.findIndex(item => item.translations.find(t => t.value === translation.name));
                            let newTranslations = [];
                            newTranslations.push(this.translationsRepo.create({
                                model: 'meta',
                                lang: lang,
                                field: 'name',
                                value: translation.name,
                                meta: { id: meta.id }
                            }));

                            newTranslations.push(this.translationsRepo.create({
                                model: 'meta',
                                lang: lang,
                                field: 'value',
                                value: translation.value,
                                meta: { id: meta.id }
                            }));
                            await this.translationsRepo.save(newTranslations);
                            let newMeta = this.metaRepo.create({ translations: newTranslations, slug: 'service', service: { id: service.id } });
                            await this.metaRepo.save(newMeta);
                            service.meta[existingNameTransIndex].translations.push(...newTranslations);
                        }
                    }
                }
            }

            if (newTranslations.length > 0) {
                await this.translationsRepo.save(newTranslations);
                await this.metaRepo.save({ translations: newTranslations, slug: 'service', service: { id: service.id } });
            }

            await this.metaRepo.save(meta);
        }




        await this.serviceRepo.save(service);

        return service;
    }

    async delete(id: number) {
        let result = await this.serviceRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: this.i18n.t('response.deleted')
        };
    }
}