import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SectionEntity } from "src/entities/section.entity";
import { TranslationsEntity } from "src/entities/translations.entity";
import { Repository } from "typeorm";
import { CreateSectionDto } from "../about/dto/create-about.dto";
import { SideEnum } from "src/shares/enums/side.enum";
import { AboutEntity } from "src/entities/about.entity";
import { UpdateSectionDto } from "./dto/update-section.dto";

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(SectionEntity)
        private sectionRepo: Repository<SectionEntity>,

        @InjectRepository(TranslationsEntity)
        private translationsRepo: Repository<TranslationsEntity>,

        @InjectRepository(AboutEntity)
        private aboutRepo: Repository<AboutEntity>,
    ) { }

    async list() {
        let result = await this.sectionRepo.find();
        return result;
    }

    async create(params: CreateSectionDto, status?: string) {
        let about;
        if (status !== 'new') {
            about = await this.aboutRepo.find();
            if (!about.length) throw new NotFoundException('First create about');
        }
        let sections: any = {
            about: about && !status && { id: about[0].id },
            left_side: {},
            right_side: {}
        };


        if (params.left_side.type == SideEnum.TEXT) {
            let item = {
                type: params.left_side.type,
                translations: []
            };
            for (let translation of params.left_side.translations) {
                item.translations.push(this.translationsRepo.create({
                    model: 'section',
                    field: 'value',
                    lang: translation.lang,
                    value: translation.value
                }));
            }
            await this.translationsRepo.save(item.translations);
            sections.left_side = item;
        } else {
            sections.left_side.type = SideEnum.IMAGE;
            sections.left_side.url = params.left_side.url;
        }

        if (params.right_side.type == SideEnum.TEXT) {
            let item = {
                type: params.right_side.type,
                translations: []
            };
            for (let translation of params.right_side.translations) {
                item.translations.push(this.translationsRepo.create({
                    model: 'section',
                    field: 'value',
                    lang: translation.lang,
                    value: translation.value
                }));
            }
            await this.translationsRepo.save(item.translations);
            sections.right_side = item;
        } else {
            sections.right_side.type = SideEnum.IMAGE;
            sections.right_side.url = params.right_side.url;
        }
        await this.sectionRepo.save(sections);

        return sections;
    }

    async update(id: number, params: UpdateSectionDto) {
        const section = await this.sectionRepo.findOne({ where: { id }, relations: ['left_side.translations', 'right_side.translations'] });

        if (!section) throw new NotFoundException('Section is not found');

        if (params.left_side) await this.updateSide(section.left_side, params.left_side);

        if (params.right_side) await this.updateSide(section.right_side, params.right_side);

        return this.sectionRepo.save(section);
    }

    private async updateSide(side: any, newSideData: any) {
        side.type = newSideData.type;

        if (newSideData.type === SideEnum.TEXT) {
            side.url = null;

            for (const translation of newSideData.translations) {
                const existing = side.translations?.find(t => t.lang === translation.lang);

                if (existing) {
                    existing.value = translation.value;
                    await this.translationsRepo.save(existing);
                } else {
                    const newTranslation = this.translationsRepo.create({
                        model: 'section',
                        field: 'value',
                        lang: translation.lang,
                        value: translation.value,
                    });
                    side.translations = side.translations ? [...side.translations, newTranslation] : [newTranslation];
                }
            }
        } else {
            side.translations = null;
            side.url = newSideData.url;
        }
    }

    async delete(id: number) {
        let result = await this.sectionRepo.delete(id);

        if (!result.affected) throw new NotFoundException('Section is not found');

        return {
            message: 'Section is deleted succesfully'
        };
    }
}