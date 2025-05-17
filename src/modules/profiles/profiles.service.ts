import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfilesEntity } from "src/entities/profile.entity";
import { Repository } from "typeorm";
import { CreateProfilesDto } from "./dto/create-profiles.dto";
import { I18nService } from "nestjs-i18n";
import { UpdateProfilesDto } from "./dto/update-profiles.dto";

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(ProfilesEntity)
        private profilesRepo: Repository<ProfilesEntity>,

        private i18n: I18nService
    ) { }

    async list(model: string) {
        let result = await this.profilesRepo.find({
            where: { model },
            select: {
                id: true,
                name: true,
                speciality: true,
                image: {
                    id: true,
                    url: true
                }
            },
            relations: ['image']
        });


        return result;
    }

    async create(params: CreateProfilesDto) {
        let profile = this.profilesRepo.create({
            name: params.name,
            model: params.model,
            speciality: params.speciality,
            image: { id: params.image }
        });

        await profile.save();

        return profile;
    }

    async update(id: number, params: UpdateProfilesDto) {
        let result = await this.profilesRepo.update(id, {
            name: params.name,
            model: params.model,
            speciality: params.speciality,
            image: { id: params.image }
        });

        if (!result.affected) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

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