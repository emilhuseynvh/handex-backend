import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StudyAreaEntity } from "src/entities/studyArea.entity";
import { Repository } from "typeorm";
import { CreateStudyAreaDto } from "./dto/create-studyArea.dto";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ProgramEntity } from "src/entities/programs.entity";
import { ClsService } from "nestjs-cls";
import { Lang } from "src/shares/enums/lang.enum";
import { I18nService } from "nestjs-i18n";
import { UpdateStudyAreaDto } from "./dto/update-studyArea.dto";
import { UploadEntity } from "src/entities/upload.entity";
import { faqTranslation, mapTranslation } from "src/shares/utils/translation.util";
import { MetaEntity } from "src/entities/meta.entity";
import { FaqEntity } from "src/entities/faq.entity";
import { GroupService } from "../group/group.service";
import { GroupEntity } from "src/entities/group.entity";

@Injectable()
export class StudyAreaService {
    constructor(
        @InjectRepository(StudyAreaEntity)
        private studyAreaRepo: Repository<StudyAreaEntity>,

        @InjectRepository(ProgramEntity)
        private programRepo: Repository<ProgramEntity>,

        @InjectRepository(MetaEntity)
        private metaRepo: Repository<MetaEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        @InjectRepository(FaqEntity)
        private faqRepo: Repository<FaqEntity>,

        @InjectRepository(GroupEntity)
        private groupRepo: Repository<GroupEntity>,

        @InjectRepository(TranslationsEntity)
        private translationRepo: Repository<TranslationsEntity>,

        private cls: ClsService,
        private i18n: I18nService
    ) { }

    async list(model: string) {
        let lang = this.cls.get<Lang>('lang');

        let result = await this.studyAreaRepo.find({
            where: {
                translations: { lang },
                model
            },
            select: {
                id: true,
                name: true,
                slug: true,
                image: {
                    id: true,
                    url: true,
                    alt: true
                }
            },
            relations: ['image']
        });
        return result;
    }

    async listOne(slug: string) {
        let lang = this.cls.get<Lang>('lang');
        let result: any = await this.studyAreaRepo.findOne({
            where: {
                slug,
                faq: { translations: { lang } },
                translations: { lang },
                program: { translations: { lang } },
                groups: {
                    text: {
                        lang
                    },
                    table: {
                        lang
                    }
                },
                meta: {
                    translations: {
                        lang: lang
                    }
                }
            },
            relations: ['image', 'faq', 'faq.translations', 'translations', 'program', 'meta', 'meta.translations', 'program.image', 'program.translations', 'groups', 'groups.text', 'groups.table']
        });

        if (!result) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
        console.log(result);

        return {
            ...mapTranslation(result),
            program: result.program.map(item => mapTranslation(item)),
            faq: result.faq.map(item => mapTranslation(item)),
            meta: result.meta.map(item => mapTranslation(item))
        };
    }

    async create(params: CreateStudyAreaDto) {
        let check = await this.studyAreaRepo.findOne({ where: { slug: params.slug } });
        if (check) throw new ConflictException(`Study area in ${params.slug} slug is already exists`);

        const studyArea = this.studyAreaRepo.create({
            name: params.name,
            slug: params.slug,
            model: params.model,
            color: params.color,
            image: params.image ? { id: params.image } : null,

            translations: params.translations.map(t =>
                this.translationRepo.create({
                    model: 'studyArea',
                    field: 'course_detail',
                    lang: t.lang,
                    value: t.course_detail,
                })
            ),

            faq: [{
                translations: params.faq.flatMap(f => [
                    this.translationRepo.create({
                        model: 'faq',
                        field: 'title',
                        lang: f.lang,
                        value: f.title,
                    }),
                    this.translationRepo.create({
                        model: 'faq',
                        field: 'description',
                        lang: f.lang,
                        value: f.description,
                    }),
                ]),
            }],

            program: params.program.map(p =>
                this.programRepo.create({
                    image: { id: p.image },
                    name: p.name,
                    translations: p.translations.map(tr =>
                        this.translationRepo.create({
                            model: 'program',
                            field: 'description',
                            lang: tr.lang,
                            value: tr.description,
                        })
                    ),
                })
            ),

            meta: (params.meta || []).map(m =>
                this.metaRepo.create({
                    slug: 'studyArea',
                    translations: m.translations.flatMap(tr => [
                        this.translationRepo.create({
                            model: 'meta',
                            field: 'name',
                            lang: tr.lang,
                            value: tr.name,
                        }),
                        this.translationRepo.create({
                            model: 'meta',
                            field: 'value',
                            lang: tr.lang,
                            value: tr.value,
                        }),
                    ]),
                })
            ),

            groups: params.group.map(g =>
                this.groupRepo.create({
                    startDate: g.startDate,
                    text: g.text.map(tx =>
                        this.translationRepo.create({
                            model: 'group',
                            field: 'text',
                            lang: tx.lang,
                            value: tx.name,
                        })
                    ),
                    table: g.table.map(tb =>
                        this.translationRepo.create({
                            model: 'group',
                            field: 'table',
                            lang: tb.lang,
                            value: tb.name,
                        })
                    ),
                })
            )
        } as any);

        const saved = await this.studyAreaRepo.save(studyArea);
        return { studyArea: saved };
    }


    async update(id: number, params: UpdateStudyAreaDto) {
        const studyArea = await this.studyAreaRepo.findOne({
            where: { id: id },
            relations: ['translations', 'faq', 'program', 'meta', 'meta.translations']
        });

        if (!studyArea) throw new NotFoundException('Study area not found');


        if (params.color) studyArea.color = params.color;

        if (params.name) studyArea.name = params.name;

        if (params.image) {
            let image = await this.uploadRepo.findOne({ where: { id: params.image } });

            if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
            studyArea.image = image;
        }

        if (params.translations) {
            const translations = [];
            for (const translation of params.translations) {
                translations.push(this.translationRepo.create({
                    model: 'studyArea',
                    field: 'course_detail',
                    value: translation.course_detail,
                    lang: translation.lang
                }));
            }
            const existingTranslations = studyArea.translations ? Array.isArray(studyArea.translations)
                ? studyArea.translations
                : [studyArea.translations]
                : [];

            const savedTranslations = await this.translationRepo.save(translations);

            studyArea.translations = [...existingTranslations, ...savedTranslations] as any;
        }

        if (params.faq) {
            const updatingFaqLangs = params.faq.map(f => f.lang);

            const existingFaq = studyArea.faq
                ? Array.isArray(studyArea.faq)
                    ? studyArea.faq
                    : [studyArea.faq]
                : [];

            const newFaqTranslations = params.faq.flatMap(faqItem => [
                this.translationRepo.create({
                    model: 'faq',
                    field: 'title',
                    value: faqItem.title,
                    lang: faqItem.lang
                }),
                this.translationRepo.create({
                    model: 'faq',
                    field: 'description',
                    value: faqItem.description,
                    lang: faqItem.lang
                })
            ]);

            const savedFaqTranslations = await this.translationRepo.save(newFaqTranslations);

            // studyArea.faq = [...faqToKeep, ...savedFaqTranslations] as any;
        }

        if (params.meta && params.meta.length > 0) {
            let meta = studyArea.meta && studyArea.meta.length > 0 ? studyArea.meta[0] : null;

            if (!meta) {
                meta = this.metaRepo.create({ studyArea: studyArea.id, slug: 'studyArea' } as any) as any;
                await this.metaRepo.save(meta);
            }

            const existingTranslations: any = [];
            for (let elem of studyArea.meta) {
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
                        newTranslations.push(this.translationRepo.create({
                            model: 'meta',
                            lang: lang,
                            field: 'name',
                            value: translation.name
                        }));

                        newTranslations.push(this.translationRepo.create({
                            model: 'meta',
                            lang: lang,
                            field: 'value',
                            value: translation.value
                        }));
                        let newMeta = this.metaRepo.create({ translations: newTranslations, slug: 'studyArea', studyArea: { id: studyArea.id } });
                        await this.metaRepo.save(newMeta);
                        studyArea.meta.push(newMeta);

                    } else {
                        const existingNameTransIndex = studyArea.meta.findIndex(item => item.translations.find(t => t.lang === lang && t.field === 'name' && t.value === translation.name) && item.translations.find(t => t.lang === lang && t.field === 'value'));
                        let existingValueTrans = studyArea.meta[existingNameTransIndex].translations.find(t => t.field === 'value');

                        if (existingValueTrans) {
                            existingValueTrans.value = translation.value;
                            await this.translationRepo.save(existingValueTrans);
                        } else {
                            const existingNameTransIndex = studyArea.meta.findIndex(item => item.translations.find(t => t.value === translation.name));
                            let newTranslations = [];
                            newTranslations.push(this.translationRepo.create({
                                model: 'meta',
                                lang: lang,
                                field: 'name',
                                value: translation.name,
                                meta: { id: meta.id }
                            }));

                            newTranslations.push(this.translationRepo.create({
                                model: 'meta',
                                lang: lang,
                                field: 'value',
                                value: translation.value,
                                meta: { id: meta.id }
                            }));
                            await this.translationRepo.save(newTranslations);
                            let newMeta = this.metaRepo.create({ translations: newTranslations, slug: 'studyArea', studyArea: { id: studyArea.id } });
                            await this.metaRepo.save(newMeta);
                            studyArea.meta[existingNameTransIndex].translations.push(...newTranslations);
                        }
                    }
                }
            }

            if (newTranslations.length > 0) {
                await this.translationRepo.save(newTranslations);
                await this.metaRepo.save({ translations: newTranslations, slug: 'studyArea', studyArea: { id: studyArea.id } });
            }

            await this.metaRepo.save(meta);
        }

        if (params.program) {
            if (studyArea.program) {
                for (const programItem of studyArea.program as any) {
                    if (programItem.translations) {
                        await this.translationRepo.remove(programItem.translations);
                    }
                }
                await this.programRepo.remove(studyArea.program);
            }

            const program = [];
            for (const element of params.program) {
                const item = this.programRepo.create({
                    name: element.name,
                    translations: []
                });

                for (const translation of element.translations) {
                    item.translations.push(this.translationRepo.create({
                        model: 'program',
                        field: 'description',
                        value: translation.description,
                        lang: translation.lang
                    }));
                }

                await this.translationRepo.save(item.translations);
                program.push(await this.programRepo.save(item));
            }
            studyArea.program = program as any;
        }
        const result = await this.studyAreaRepo.save(studyArea);

        return {
            result
        };
    }

    async delete(id: number) {
        let result = await this.studyAreaRepo.delete(id);

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: this.i18n.t('response.deleted')
        };
    }
}