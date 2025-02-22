import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetaEntity } from "src/entities/meta.entity";
import { MetaController } from "./meta.controller";
import { MetaService } from "./meta.service";
import { TranslationsEntity } from "src/entities/translations.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MetaEntity, TranslationsEntity])],
    controllers: [MetaController],
    providers: [MetaService]
})
export class MetaModule { }