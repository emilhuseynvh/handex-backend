import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { I18nService } from "nestjs-i18n";
import { ContentEntity } from "src/entities/content.entity";
import { FindOptionsWhere, ILike, In, Repository } from "typeorm";
import { CreateAboutDto } from "./content-dto/create-content.dto";
import { TranslationsEntity } from "src/entities/translations.entity";
import { mapTranslation } from "src/shares/utils/translation.util";
import { MetaService } from "../meta/meta.service";
import { UpdateContentDto } from "./content-dto/update-content.dto";
import { UploadEntity } from "src/entities/upload.entity";

@Injectable()
export class ContentService {
    constructor(
        @InjectRepository(ContentEntity)
        private contentRepo: Repository<ContentEntity>,

        @InjectRepository(TranslationsEntity)
        private translationRepo: Repository<TranslationsEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,


        private metaService: MetaService,

        private cls: ClsService,
        private i18n: I18nService
    ) { }

    async get(slug: string, query: string) {
        let lang = this.cls.get('lang');

        let where: FindOptionsWhere<ContentEntity> = {
            slug: slug,
            translations: { lang },
            meta: { translations: { lang } },
        };

        if (query) {
            where.translations = {
                lang,
                value: ILike(`%${query}%`)
            };
        }

        const result = await this.contentRepo.find({
            where,
            relations: ['translations', 'meta.translations', 'images']
        });


        if (!result.length) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return result.map(item => ({
            ...mapTranslation(item),
            meta: item.meta.map(meta => mapTranslation(meta))
        }));
    }

    async create(params: CreateAboutDto) {
        let content = this.contentRepo.create({ slug: params.slug });
        content = await this.contentRepo.save(content);

        let translations: TranslationsEntity[] = [];

        for (let translation of params.translations) {
            translations.push(this.translationRepo.create({
                model: 'content',
                field: 'title',
                lang: translation.lang,
                value: translation.title
            }));

            translations.push(this.translationRepo.create({
                model: 'content',
                field: 'desc',
                lang: translation.lang,
                value: translation.desc
            }));
        }

        await this.translationRepo.save(translations);

        let meta = await this.metaService.create({ ...params.meta[0], content: content.id });

        if (params.images) {
            const images = await this.uploadRepo.findBy({
                id: In(params.images)
            });
            content.images = images;
        }

        content.translations = translations;
        content.meta = [meta];

        return await this.contentRepo.save(content);
    }

    async update(id: number, params: UpdateContentDto) {
        let existingContent = await this.contentRepo.findOne({
            where: { id },
            relations: ['translations', 'meta', 'meta.translations']
        });

        if (!existingContent) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        if (params.translations.length) {
            if (existingContent.translations?.length) await this.translationRepo.remove(existingContent.translations);


            const newTranslations = [];

            for (let translation of params.translations) {
                newTranslations.push(this.translationRepo.create({
                    model: 'content',
                    field: 'title',
                    lang: translation.lang,
                    value: translation.title
                }));
            }

            for (let translation of params.translations) {
                newTranslations.push(this.translationRepo.create({
                    model: 'content',
                    field: 'desc',
                    lang: translation.lang,
                    value: translation.desc
                }));
            }

            await this.translationRepo.save(newTranslations);

            existingContent.translations = newTranslations;
        }

        if (params.meta && params.meta.length > 0) {
            if (existingContent.meta && existingContent.meta.length > 0) {
                await this.metaService.deleteMeta(existingContent.meta[0].id);
            }
            let newMeta = await this.metaService.create({
                ...params.meta[0],
                content: existingContent
            });
            existingContent.meta = [newMeta];
        }





        let result = await this.contentRepo.save(existingContent);

        return result;
    }

    async delete(id: number) {
        let result = await this.contentRepo.delete(id);
        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: this.i18n.t('response.deleted')
        };
    }

}