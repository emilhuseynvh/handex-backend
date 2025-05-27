import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfilesEntity } from "src/entities/profile.entity";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";
import { TranslationsEntity } from "src/entities/translations.entity";
import { UploadEntity } from "src/entities/upload.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProfilesEntity, TranslationsEntity, UploadEntity])],
    controllers: [ProfilesController],
    providers: [ProfilesService]
})
export class ProfilesModule { }