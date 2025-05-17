import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsString, MinLength, ValidateNested } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { Lang } from "src/shares/enums/lang.enum";

export class CreateAboutTranslationsDto {
    @Type()
    @MinLength(3, { message: i18nValidationMessage('validation.validationMessages.minLength') })
    @ApiProperty({ required: true })
    title: string;

    @Type()
    @MinLength(3, { message: i18nValidationMessage('validation.validationMessages.minLength') })
    @ApiProperty({ required: true })
    desc: string;

    @Type()
    @MinLength(1, { message: i18nValidationMessage('validation.validationMessages.minLength') })
    @ApiProperty({ required: true, default: 'az' })
    @IsEnum(Lang)
    lang: Lang;
}

export class CreateAboutDto {
    @Type(() => CreateAboutTranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: CreateAboutTranslationsDto, isArray: true })
    translations: CreateAboutTranslationsDto[];

    @Type()
    @IsArray()
    @ApiProperty({ default: [1] })
    images: number[];

    @Type()
    @IsString()
    @ApiProperty({ default: 'hero' })
    slug: string
}