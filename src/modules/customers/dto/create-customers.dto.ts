import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsString, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { Lang } from "src/shares/enums/lang.enum";

export class CreateCustomersTranslationsDto {
    @Type()
    @MinLength(3, { message: i18nValidationMessage('validation.validationMessages.minLength') })
    @ApiProperty({ required: true, default: 'This is a difficult, vivid, heartbreaking, beautiful read. So worth investing some time to go through slowly. Footman is one to watch.' })
    comment: string;

    @Type()
    @MinLength(1, { message: i18nValidationMessage('validation.validationMessages.minLength') })
    @ApiProperty({ required: true, default: 'en' })
    @IsEnum(Lang)
    lang: Lang;
}

export class CreateCustomersDto {
    @Type()
    @IsString()
    @ApiProperty({ default: 'Emil Hüseynov' })
    name: string;

    @Type()
    @IsString()
    @ApiProperty({ default: 'Pasha Bank' })
    bank_name: string;

    @Type()
    @IsNumber()
    @ApiProperty({ default: 0 })
    bank_logo: number;

    @Type()
    @IsNumber()
    @ApiProperty({ default: 0 })
    customer_profile: number;

    @Type(() => CreateCustomersTranslationsDto)
    @IsArray()
    @ApiProperty({ type: [CreateCustomersTranslationsDto] })
    translations: CreateCustomersTranslationsDto[];
}