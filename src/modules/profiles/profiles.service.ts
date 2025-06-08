import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfilesEntity } from "src/entities/profile.entity";
import { Repository } from "typeorm";
import { CreateProfilesDto } from "./dto/create-profiles.dto";
import { I18nService } from "nestjs-i18n";
import { UpdateProfilesDto } from "./dto/update-profiles.dto";
import { TranslationsEntity } from "src/entities/translations.entity";
import { ClsService } from "nestjs-cls";
import { Lang } from "src/shares/enums/lang.enum";
import { UploadEntity } from "src/entities/upload.entity";
import { mapTranslation } from "src/shares/utils/translation.util";

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(ProfilesEntity)
        private profilesRepo: Repository<ProfilesEntity>,

        @InjectRepository(TranslationsEntity)
        private translationsRepo: Repository<TranslationsEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        private cls: ClsService,

        private i18n: I18nService
    ) { }

    async list(model: string) {
        const lang = this.cls.get<Lang>('lang');

        const qb = this.profilesRepo.createQueryBuilder('profile')
            .leftJoinAndSelect('profile.image', 'image')
            .leftJoinAndSelect('profile.translations', 'translations');

        qb.where('profile.model = :model', { model });

        if (lang) {
            qb.andWhere('(translations.lang = :lang OR translations.id IS NULL)', { lang });
        }

        const result = await qb.select([
            'profile.id',
            'profile.name',
            'profile.speciality',
            'image.id',
            'image.url',
            'image.alt',
            'translations'
        ]).getMany();

        return result.map(item => item.translations ? mapTranslation(item) : item);
    }


    async create(params: CreateProfilesDto) {
        let translation = params.translations && params.translations.length ?
            params.translations.map(t =>
                this.translationsRepo.create({
                    model: 'profile',
                    field: 'description',
                    lang: t.lang,
                    value: t.description,
                })
            ) : undefined;
        let profile = this.profilesRepo.create({
            name: params.name,
            model: params.model,
            speciality: params.speciality,
            image: { id: params.image },
            translations: translation
        });

        await this.profilesRepo.save(profile);

        return profile;
    }

    async update(id: number, params: UpdateProfilesDto) {
        let profile = await this.profilesRepo.findOne({ where: { id } });
        if (!profile) throw new NotFoundException('Profile is not found');

        let image = await this.uploadRepo.findOne({ where: { id: params.image } });

        if (!image) throw new NotFoundException('image is not found');

        profile.image = image;
        profile.name = params.name;
        profile.speciality = params.speciality;

        if (params.translations && params.translations.length) {
            let newTranslations = [];
            for (let t of params.translations) {
                let check = profile.translations.findIndex(item => item.lang === t.lang);
                if (check !== -1) {
                    profile.translations[check] = this.translationsRepo.create({
                        model: 'profile',
                        field: 'description',
                        lang: t.lang,
                        value: t.description,
                    });
                } else {
                    newTranslations.push(this.translationsRepo.create({
                        model: 'profile',
                        field: 'description',
                        lang: t.lang,
                        value: t.description,
                    }));
                    profile.translations.push(...newTranslations);
                }
            }
        }

        await profile.save();


        return {
            message: this.i18n.t('Updated succesfully')
        };
    }

    async deleteProfile(id: number) {
        let result = await this.profilesRepo.delete(id);
        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        return {
            message: "Profile deleted succesfully"
        };

    }
}