import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { AboutEntity } from "src/entities/about.entity";
import { SectionEntity } from "src/entities/section.entity";
import { SideEntity } from "src/entities/side.entity";
import { Lang } from "src/shares/enums/lang.enum";
import { In, Repository } from "typeorm";
import { CreateAboutDto } from "../content/content-dto/create-content.dto";
import { CreateAboutPageDto } from "./dto/create-about.dto";
import { SideEnum } from "src/shares/enums/side.enum";
import { TranslationsEntity } from "src/entities/translations.entity";
import { SectionService } from "../section/section.service";
import { UpdateAboutPageDto } from "./dto/update-about.dto";
import { UploadEntity } from "src/entities/upload.entity";
import { mapTranslation } from "src/shares/utils/translation.util";

@Injectable()
export class AboutService {
    constructor(
        @InjectRepository(AboutEntity)
        private aboutRepo: Repository<AboutEntity>,

        @InjectRepository(SectionEntity)
        private sectionRepo: Repository<SectionEntity>,

        @InjectRepository(TranslationsEntity)
        private translationsRepo: Repository<TranslationsEntity>,

        @InjectRepository(SideEntity)
        private sideRepo: Repository<SideEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        private sectionService: SectionService,

        private cls: ClsService
    ) { }

    async list() {
        let lang = this.cls.get<Lang>('lang');
        let result = await this.aboutRepo.find({
            where: {
                sections: {
                    left_side: {
                        translations: { lang }
                    },
                    right_side: {
                        translations: { lang }
                    }
                }
            }
        });

        return result;
    }

    async create(params: CreateAboutPageDto) {
        let about: any = {
            images: [],
            sections: []
        };

        about.images = await this.uploadRepo.find({
            where: {
                id: In(params.images)
            }
        });

        let sections = await this.sectionService.create(params.sections[0], 'new');

        about.sections[0] = sections;

        await this.aboutRepo.save(about);

        return about;
    }

    async update(id: number, params: UpdateAboutPageDto) {
        let about = await this.aboutRepo.findOne({ where: { id } });

        if (!about) throw new NotFoundException('About is not found');


    }

    async delete(id: number) {
        let result = await this.aboutRepo.delete(id);

        if (!result.affected) throw new NotFoundException('About is not found');

        return {
            message: "About deleted succesfully"
        };
    }
}