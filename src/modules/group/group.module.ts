import { Module } from "@nestjs/common";
import { GroupService } from "./group.service";
import { GroupController } from "./group.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupEntity } from "src/entities/group.entity";
import { TranslationsEntity } from "src/entities/translations.entity";

@Module({
    imports: [TypeOrmModule.forFeature([GroupEntity, TranslationsEntity])],
    controllers: [GroupController],
    providers: [GroupService]
})
export class GroupModule { }