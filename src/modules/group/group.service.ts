import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { GroupEntity } from "src/entities/group.entity";
import { Lang } from "src/shares/enums/lang.enum";
import { Repository } from "typeorm";
import { CreateGroupDto } from "./dto/create-group.dto";
import { TranslationsEntity } from "src/entities/translations.entity";
import { UpdateGroupDto } from "./dto/update-group.dto";

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(GroupEntity)
        private groupRepo: Repository<GroupEntity>,

        @InjectRepository(TranslationsEntity)
        private translationsRepo: Repository<TranslationsEntity>,

        private cls: ClsService
    ) { }

    async list(studyAreaId: number) {
        let lang = this.cls.get<Lang>('lang');
        let result = await this.groupRepo.find({
            where: {
                studyArea: { id: studyAreaId },
                text: { lang },
                table: { lang }
            }
        });

        return result;
    }

    async create(params: CreateGroupDto) {
        let group = {
            text: [],
            table: [],
            startDate: '',
            studyArea: { id: 0 }
        };

        for (let translation of params.text) {
            group.text.push(this.translationsRepo.create({
                model: 'group',
                field: 'text',
                value: translation.name,
                lang: translation.lang
            }));
        }

        for (let translation of params.table) {
            group.table.push(this.translationsRepo.create({
                model: 'group',
                field: 'table',
                value: translation.name,
                lang: translation.lang
            }));
        }
        group.startDate = params.startDate;
        group.studyArea = { id: params.studyArea };

        await this.groupRepo.save(group);

        return {
            message: 'Group created succesfully',
            group
        };
    }

    async update(id: number, params: UpdateGroupDto) {
        let group = await this.groupRepo.findOne({ where: { id } });
        if (!group) throw new NotFoundException('Group is not found');

        if (params.startDate) group.startDate = params.startDate;

        if (params.table && params.table.length) {
            for (let translation of params.table) {
                let check = group.table.findIndex(t => t.lang === translation.lang);

                if (check !== -1) {
                    group.table[check] = this.translationsRepo.create({
                        model: 'group',
                        field: 'table',
                        lang: translation.lang,
                        value: translation.name,
                    });
                } else {
                    group.table.push(this.translationsRepo.create({
                        model: 'group',
                        field: 'table',
                        lang: translation.lang,
                        value: translation.name,
                    }));
                }
            }
        }

        if (params.text && params.text.length) {
            for (let translation of params.text) {
                let check = group.text.findIndex(t => t.lang === translation.lang);

                if (check !== -1) {
                    group.text[check] = this.translationsRepo.create({
                        model: 'group',
                        field: 'text',
                        lang: translation.lang,
                        value: translation.name,
                    });
                } else {
                    group.text.push(this.translationsRepo.create({
                        model: 'group',
                        field: 'text',
                        lang: translation.lang,
                        value: translation.name,
                    }));
                }
            }
        }

        await group.save();

        return {
            "message": "Group updated succesfully"
        };
    }

    async delete(id: number) {
        let result = await this.groupRepo.delete(id);

        if (!result.affected) throw new NotFoundException('group is not found');

        return {
            message: 'group deleted succesfully'
        };
    }
}