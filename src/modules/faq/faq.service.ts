import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { FaqEntity } from "src/entities/faq.entity";
import { UserEntity } from "src/entities/user.entity";
import { Lang } from "src/shares/enums/lang.enum";
import { faqTranslation, mapTranslation } from "src/shares/utils/translation.util";
import { Repository } from "typeorm";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { TranslationsEntity } from "src/entities/translations.entity";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { StudyAreaEntity } from "src/entities/studyArea.entity";

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(FaqEntity)
        private faqRepo: Repository<FaqEntity>,

        @InjectRepository(StudyAreaEntity)
        private studyAreaRepo: Repository<StudyAreaEntity>,

        @InjectRepository(TranslationsEntity)
        private translationsRepo: Repository<TranslationsEntity>,

        private cls: ClsService
    ) { }

    async list(studyArea: number) {
        let lang = this.cls.get<Lang>('lang');
        let result = await this.faqRepo.find({
            where: {
                translations: { lang },
                studyArea: { id: studyArea }
            },
            relations: ['translations', 'studyArea']
        });

        return result.map(item => mapTranslation(item));
    }

    async create(params: CreateFaqDto) {
        let check = await this.studyAreaRepo.findOne({ where: { id: params.areaStudy } });

        if (!check) throw new NotFoundException('Study Area is not found');

        let translations = [];
        let newTranslations;

        for (let translation of params.translations) {
            translations.push({
                model: 'faq',
                lang: translation.lang,
                field: 'title',
                value: translation.title
            });

            translations.push({
                model: 'faq',
                lang: translation.lang,
                field: 'description',
                value: translation.description
            });

            newTranslations = this.translationsRepo.create(translations);
        }

        let result = this.faqRepo.create({
            studyArea: { id: params.areaStudy },
            translations: newTranslations
        });

        await result.save();

        return result;
    }

    async update(id: number, params: UpdateFaqDto) {
        const faq = await this.faqRepo.findOne({
            where: { id },
            relations: ['translations']
        });

        if (!faq) throw new NotFoundException('FAQ not found');

        if (params.translations && params.translations.length) {
            const updatingLangs = params.translations.map(t => t.lang);

            const translationsToRemove = faq.translations.filter(t =>
                updatingLangs.includes(t.lang)
            );

            if (translationsToRemove.length) {
                await this.translationsRepo.remove(translationsToRemove);
            }

            const newTranslations = params.translations.flatMap(translation => [
                this.translationsRepo.create({
                    model: 'faq',
                    lang: translation.lang,
                    field: 'title',
                    value: translation.title
                }),
                this.translationsRepo.create({
                    model: 'faq',
                    lang: translation.lang,
                    field: 'description',
                    value: translation.description
                })
            ]);

            const savedTranslations = await this.translationsRepo.save(newTranslations);

            faq.translations = [
                ...faq.translations.filter(t => !updatingLangs.includes(t.lang)),
                ...savedTranslations
            ];
        }

        await this.faqRepo.save(faq);

        return {
            message: 'FAQ updated successfully'
        };
    }

    async delete(id: number) {
        let result = await this.faqRepo.delete(id);

        if (!result.affected) throw new NotFoundException('FAQ is not found');

        return {
            message: 'FAQ deleted succesfully'
        };
    }
}