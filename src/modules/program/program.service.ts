import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { ProgramEntity } from "src/entities/programs.entity";
import { Lang } from "src/shares/enums/lang.enum";
import { mapTranslation } from "src/shares/utils/translation.util";
import { Repository } from "typeorm";
import { TranslationsEntity } from "src/entities/translations.entity";
import { CreateProgramDto } from "./dto/create-program.dto";
import { StudyAreaEntity } from "src/entities/studyArea.entity";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { UploadEntity } from "src/entities/upload.entity";

@Injectable()
export class ProgramService {
    constructor(
        @InjectRepository(ProgramEntity)
        private programRepo: Repository<ProgramEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        @InjectRepository(TranslationsEntity)
        private translationRepo: Repository<TranslationsEntity>,

        @InjectRepository(StudyAreaEntity)
        private studyAreaRepo: Repository<StudyAreaEntity>,

        private cls: ClsService
    ) { }

    async list(areaId: number) {
        let lang = this.cls.get<Lang>('lang');
        let result = await this.programRepo.find({
            where: {
                translations: { lang },
                studyArea: { id: areaId }
            },
            relations: ['translations', 'image']
        });

        return result.map(item => mapTranslation(item));
    }

    async create(params: CreateProgramDto) {
        let check = await this.studyAreaRepo.findOne({ where: { id: params.studyArea } });

        if (!check) throw new NotFoundException('Study Area is not found');

        let translations = [];

        for (let translation of params.translations) {
            translations.push({
                model: 'program',
                lang: translation.lang,
                field: 'description',
                value: translation.description
            });
        }

        let newTranslations = this.translationRepo.create(translations);

        let result = this.programRepo.create({
            name: params.name,
            image: { id: params.image },
            studyArea: { id: params.studyArea },
            translations: newTranslations
        });

        await result.save();

        return result;
    }

    async update(id: number, params: UpdateProgramDto) {
        const program = await this.programRepo.findOne({
            where: { id },
            relations: ['translations'],
        });

        if (!program) throw new NotFoundException('Program is not found');

        if (params.image) {
            let image = await this.uploadRepo.findOne({ where: { id: params.image } });
            if (!image) throw new NotFoundException('Image is not found');
            program.image = image;
        }

        if (params.name) program.name = params.name;

        if (params.translations && params.translations.length) {
            for (const translation of params.translations) {
                let existingTranslation = program.translations.find(t => t.lang === translation.lang && t.field === 'description');

                if (existingTranslation) existingTranslation.value = translation.description;
                else {
                    const newTranslation = this.translationRepo.create({
                        model: 'program',
                        lang: translation.lang,
                        field: 'description',
                        value: translation.description,
                        program: { id },
                    });

                    program.translations.push(newTranslation);
                }
            }

            await this.translationRepo.save(program.translations);
        }

        await this.programRepo.save(program);

        return {
            message: "Program is updated succesfully"
        };
    }


    async delete(id: number) {
        let result = await this.programRepo.delete(id);

        if (!result.affected) throw new NotFoundException('Program is not found');

        return {
            message: 'Program deleted succesfully'
        };
    }
}