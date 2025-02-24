import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, MinLength, ValidateNested } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { UploadEntity } from "src/entities/upload.entity";
import { I18nTranslations } from "src/generated/i18n.generated";
import { CreateMetaDto } from "src/modules/meta/meta-dto/create-meta.dto";
import { Lang } from "src/shares/enums/lang.enum";

class CreateAboutTranslationsDto {
    @Type()
    @MinLength(3, { message: i18nValidationMessage<I18nTranslations>('validation.validationMessages.minLength') })
    @ApiProperty({ required: true })
    title: string;

    @Type()
    @MinLength(3, { message: i18nValidationMessage<I18nTranslations>('validation.validationMessages.minLength') })
    @ApiProperty({ required: true })
    desc: string;

    @Type()
    @MinLength(1, { message: i18nValidationMessage<I18nTranslations>('validation.validationMessages.minLength') })
    @ApiProperty({ required: true })
    lang: Lang;
}

export class CreateAboutDto {
    @Type(() => CreateAboutTranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: CreateAboutTranslationsDto, isArray: true })
    translations: CreateAboutTranslationsDto[];

    @Type()
    @IsNumber()
    @ApiProperty()
    images: UploadEntity[];

    @Type()
    @IsString()
    @ApiProperty()
    slug: string

    @Type()
    @IsArray()
    @ApiProperty()
    meta: CreateMetaDto
}