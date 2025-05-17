import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UploadService } from "../upload/upload.service";
import { I18nService } from "nestjs-i18n";
import { ClsService } from "nestjs-cls";
import { mapTranslation } from "src/shares/utils/translation.util";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaService } from "../meta/meta.service";
import { UploadEntity } from "src/entities/upload.entity";
import { ProjectEntity } from "src/entities/project.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectEntity)
        private projectRepo: Repository<ProjectEntity>,

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
        let [result, total] = await this.projectRepo.findAndCount({
            where: {
                translations: { lang },
                meta: { translations: { lang, model: 'meta' } }
            },
            take: 8,
            skip: page * 8,
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

        result = result.map(item => mapTranslation(item));

        return {
            data: result,
            currentPage: page,
            totalPages: Math.ceil(total / 12),
            totalItems: total,
        };
    }

    async findOne(slug: string) {
        let lang = this.cls.get('lang');
        let result = await this.projectRepo.findOne({
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
        if (!result) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return mapTranslation(result);
    }

    async create(params: CreateProjectDto) {
        let image = await this.uploadRepo.findOne({ where: { id: params.image } });

        if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        let check = await this.projectRepo.findOne({ where: { slug: params.slug } });

        if (check) throw new NotFoundException(`Project in the ${params.slug} slug is exists`);

        let project = this.projectRepo.create({
            image,
            slug: params.slug
        });

        await this.projectRepo.save(project);

        let translations = [];

        for (let translation of params.translations) {
            translations.push({
                model: 'project',
                lang: translation.lang,
                field: 'title',
                value: translation.title
            });

            translations.push({
                model: 'project',
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

        let meta = this.metaRepo.create({ translations: metaTranslations, project: project.id, slug: 'project' } as any);

        project.translations = translations;
        project.meta = [meta] as any;

        await this.projectRepo.save(project);

        return project;
    }

    async update(id: number, params: UpdateProjectDto) {
        let project = await this.projectRepo.findOne({
            where: { id },
            relations: ['translations', 'image', 'meta', 'meta.translations']
        });

        if (!project) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        if (params.image) {
            const image = await this.uploadRepo.findOne({ where: { id: params.image } });
            if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
            project.image = image;
        }

        if (params.slug) {
            project.slug = params.slug;
        }

        await this.projectRepo.save(project);

        if (params.translations && params.translations.length > 0) {
            const existingTranslations = project.translations || [];

            for (const translation of params.translations) {
                const lang = translation.lang;

                const existingTitleTranslation = existingTranslations.find(
                    t => t.lang === lang && t.field === 'title'
                );

                if (existingTitleTranslation) {
                    existingTitleTranslation.value = translation.title;
                    await this.projectRepo.manager.save(existingTitleTranslation);
                } else {
                    const newTitleTranslation: any = {
                        model: 'project',
                        lang: lang,
                        field: 'title',
                        value: translation.title,
                        entityId: project.id
                    };
                    project.translations.push(newTitleTranslation);
                }

                const existingDescTranslation = existingTranslations.find(
                    t => t.lang === lang && t.field === 'description'
                );

                if (existingDescTranslation) {
                    existingDescTranslation.value = translation.description;
                    await this.projectRepo.manager.save(existingDescTranslation);
                } else {
                    const newDescTranslation: any = {
                        model: 'project',
                        lang: lang,
                        field: 'description',
                        value: translation.description,
                        entityId: project.id
                    };
                    project.translations.push(newDescTranslation);
                }
            }
        }

        if (params.meta && params.meta.length > 0) {
            let meta = project.meta && project.meta.length > 0 ? project.meta[0] : null;

            if (!meta) {
                meta = this.metaRepo.create({ project: project.id, slug: 'project' } as any) as any;
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

        await this.projectRepo.save(project);

        return project;
    }

    async delete(id: number) {
        let result = await this.projectRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: this.i18n.t('response.deleted')
        };
    }
}