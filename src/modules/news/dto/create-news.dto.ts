import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { MetaEntity } from "src/entities/meta.entity";
import { CreateMetaDto } from "src/modules/meta/meta-dto/create-meta.dto";
import { Lang } from "src/shares/enums/lang.enum";

class CreateNewsTranslationsDto {
    @Type(() => String)
    @IsString()
    @ApiProperty({ default: 'title' })
    title: string;

    @Type(() => String)
    @IsString()
    @ApiProperty({ default: 'description' })
    description: string;

    @Type(() => String)
    @IsEnum(Lang)
    @ApiProperty({ default: Lang.AZ })
    lang: Lang;
}

export class CreateNewsDto {
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ default: 1 })
    image: number;

    @Type(() => CreateNewsTranslationsDto)
    @IsArray()
    @ApiProperty({ type: [CreateNewsTranslationsDto] })
    translations: CreateNewsTranslationsDto[];

    @Type(() => CreateMetaDto)
    @IsArray()
    @ApiProperty()
    meta: CreateMetaDto[];
}