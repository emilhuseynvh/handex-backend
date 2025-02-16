import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "src/generated/i18n.generated";
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
    images: number[];

    @Type()
    @IsString()
    @ApiProperty()
    slug: string
}