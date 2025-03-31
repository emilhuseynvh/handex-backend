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

@Injectable()
export class StudyAreaService {
    constructor(
        @InjectRepository(StudyAreaEntity)
        private studyAreaRepo: Repository<StudyAreaEntity>,

        @InjectRepository(ProgramEntity)
        private programRepo: Repository<ProgramEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        @InjectRepository(TranslationsEntity)
        private translationRepo: Repository<TranslationsEntity>,

        private cls: ClsService,
        private i18n: I18nService
    ) { }

    async list() {
        let lang = this.cls.get<Lang>('lang');

        let result = await this.studyAreaRepo.find({
            where: {
                faq: { lang },
                translations: { lang },
                program: { translations: { lang } }
            },
            relations: ['image', 'faq', 'translations', 'program', 'program.translations']
        });

        return result.map((item: any) => ({
            ...mapTranslation(item),
            program: item.program.map(item => mapTranslation(item)),
            faq: faqTranslation(item.faq)
        }));
    }

    async listOne(slug: string) {
        let lang = this.cls.get<Lang>('lang');
        let result: any = await this.studyAreaRepo.findOne({
            where: {
                slug,
                faq: { lang },
                translations: { lang },
                program: { translations: { lang } }
            },
            relations: ['image', 'faq', 'translations', 'program', 'program.translations']
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

        let faqTranslations = [];

        for (let translation of params.faq) {
            faqTranslations.push(this.translationRepo.create({
                model: 'faq',
                field: 'title',
                value: translation.title,
                lang: translation.lang
            }));

            faqTranslations.push(this.translationRepo.create({
                model: 'faq',
                field: 'description',
                value: translation.description,
                lang: translation.lang
            }));
        }

        let program = [];

        for (let element of params.program) {
            let item = {
                name: '',
                translations: []
            };
            item.name = element.name;

            for (let translation of element.translations) {
                item.translations.push(this.translationRepo.create({
                    model: 'program',
                    field: 'description',
                    value: translation.description,
                    lang: translation.lang
                }));
            }

            program.push(item);
            await this.translationRepo.save(item.translations);
        }

        await this.programRepo.save(program);



        await this.translationRepo.save(faqTranslations);

        let result = this.studyAreaRepo.create({
            name: params.name,
            slug: params.slug,
            image: { id: params.image },
            translations,
            faq: faqTranslations,
            program: program

        } as any);

        await this.studyAreaRepo.save(result);

        return {
            result
        };

    }

    async update(id: number, params: UpdateStudyAreaDto) {
        const studyArea = await this.studyAreaRepo.findOne({
            where: { id: id },
            relations: ['translations', 'faq', 'program']
        });

        if (!studyArea) {
            throw new NotFoundException('Study area not found');
        }

        if (params.name) {
            studyArea.name = params.name;
        }

        if (params.image) {
            let image = await this.uploadRepo.findOne({ where: { id: params.image } });

            if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));
            studyArea.image = image;
        }

        if (params.translations) {
            await this.translationRepo.remove(studyArea.translations);

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
            studyArea.translations = await this.translationRepo.save(translations) as any;
        }

        if (params.faq) {
            if (studyArea.faq) {
                await this.translationRepo.remove(studyArea.faq);
            }

            const faqTranslations = [];
            for (const translation of params.faq) {
                faqTranslations.push(this.translationRepo.create({
                    model: 'faq',
                    field: 'title',
                    value: translation.title,
                    lang: translation.lang
                }));

                faqTranslations.push(this.translationRepo.create({
                    model: 'faq',
                    field: 'description',
                    value: translation.description,
                    lang: translation.lang
                }));
            }
            studyArea.faq = await this.translationRepo.save(faqTranslations) as any;
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