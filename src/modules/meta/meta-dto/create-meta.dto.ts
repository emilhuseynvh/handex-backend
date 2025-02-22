import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ContentEntity } from "src/entities/content.entity";
import { Lang } from "src/shares/enums/lang.enum";

export class CreateMetaTranslationsDto {
    @Type()
    @IsString()
    @ApiProperty({ required: true })
    name: string;

    @Type()
    @IsString()
    @ApiProperty({ required: true })
    value: string;

    @Type()
    @IsString()
    @ApiProperty({ required: true })
    lang: Lang;
}

export class CreateMetaDto {


    @Type()
    @IsNumber()
    @IsOptional()
    @ApiProperty({ default: 1 })
    content?: ContentEntity;

    @Type(() => CreateMetaTranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: CreateMetaTranslationsDto, isArray: true })
    translations: CreateMetaTranslationsDto[];
}