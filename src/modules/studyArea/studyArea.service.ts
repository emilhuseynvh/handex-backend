import { Injectable, NotFoundException } from "@nestjs/common";
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

        @InjectRepository(TranslationsEntity)
        private translationRepo: Repository<TranslationsEntity>,

        private cls: ClsService,
        private i18n: I18nService
    ) { }

    async list() {
        let lang = this.cls.get<Lang>('lang');

        let result = await this.studyAreaRepo.find({
            where: {
                translations: { lang },
            },
            relations: ['image', 'faq', 'faq.translations', 'translations', 'program', 'program.translations', 'meta', 'meta.translations']
        });

        return result.map((item: any) => ({
            ...mapTranslation(item),
            program: item.program.map(item => mapTranslation(item)),
            faq: item.faq.map(item => mapTranslation(item)),
            meta: item.meta.map(item => mapTranslation(item))
        }));
    }

    async listOne(slug: string) {
        let lang = this.cls.get<Lang>('lang');
        let result: any = await this.studyAreaRepo.findOne({
            where: {
                slug,
                faq: { translations: { lang } },
                translations: { lang },
                program: { translations: { lang } }
            },
            relations: ['image', 'faq', 'faq.translations', 'translations', 'program', 'program.translations']
        });

        if (!result) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
        console.log(result);


        return {
            ...mapTranslation(result),
            program: result.program.map(item => mapTranslation(item)),
            faq: faqTranslation(result.faq)
        };
    }

    async create(params: CreateStudyAreaDto) {
        let translations = [];
        for (let translation of params.translations) {
            translations.push(this.translationRepo.create({
                model: 'studyArea',
                field: 'date',
                value: translation.date,
                lang: translation.lang
            }));

            translations.push(this.translationRepo.create({
                model: 'studyArea',
                field: 'course_detail',
                value: translation.course_detail,
                lang: translation.lang
            }));
        }
        await this.translationRepo.save(translations);
        let faq = [];
        let item = {
            translations: []
        };
        for (let translation of params.faq) {
            item.translations.push(this.translationRepo.create({
                model: 'faq',
                field: 'title',
                value: translation.title,
                lang: translation.lang
            }));

            item.translations.push(this.translationRepo.create({
                model: 'faq',
                field: 'description',
                value: translation.description,
                lang: translation.lang
            }));
        }
        await this.translationRepo.save(item.translations);
        faq.push(this.faqRepo.create(item));

        let program = [];
        for (let element of params.program) {
            let item = {
                name: element.name,
                translations: []
            };

            for (let translation of element.translations) {
                item.translations.push(this.translationRepo.create({
                    model: 'program',
                    field: 'description',
                    value: translation.description,
                    lang: translation.lang
                }));
            }

            await this.translationRepo.save(item.translations);
            program.push(this.programRepo.create(item));
        }
        await this.programRepo.save(program);

        let metaEntries = [];
        if (params.meta && params.meta.length > 0) {
            for (let metaItem of params.meta) {
                if (metaItem.translations && Array.isArray(metaItem.translations)) {
                    let metaTranslations = [];
                    for (let translation of metaItem.translations) {
                        metaTranslations.push(this.translationRepo.create({
                            model: 'meta',
                            field: 'name',
                            lang: translation.lang,
                            value: translation.name,
                        }));

                        metaTranslations.push(this.translationRepo.create({
                            model: 'meta',
                            field: 'value',
                            lang: translation.lang,
                            value: translation.value,
                        }));
                    }

                    await this.translationRepo.save(metaTranslations);

                    const metaEntry = this.metaRepo.create({
                        translations: metaTranslations,
                        slug: 'studyArea'
                    });

                    const savedMeta = await this.metaRepo.save(metaEntry);
                    metaEntries.push(savedMeta);
                }
            }
        }

        let studyArea = this.studyAreaRepo.create({
            name: params.name,
            slug: params.slug,
            color: params.color,
            meta: metaEntries,
            image: params.image ? { id: params.image } : null,
            translations: translations,
            faq: faq,
            program: program
        } as any);

        await this.studyAreaRepo.save(studyArea);

        return { studyArea };
    }

    async update(id: number, params: UpdateStudyAreaDto) {
        const studyArea = await this.studyAreaRepo.findOne({
            where: { id: id },
            relations: ['translations', 'faq', 'program']
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
                    field: 'date',
                    value: translation.date,
                    lang: translation.lang
                }));

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

            const faqToKeep = existingFaq.filter(f =>
                !updatingFaqLangs.includes(f.lang)
            );

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

            studyArea.faq = [...faqToKeep, ...savedFaqTranslations] as any;
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