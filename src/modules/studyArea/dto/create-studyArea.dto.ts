import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { Lang } from "src/shares/enums/lang.enum";

export class CreateStudyAreaTranslationsDto {
    @Type()
    @IsString()
    @ApiProperty({ default: '5 ay, həftədə 3 dəfə' })
    date: string;

    @Type()
    @IsString()
    @ApiProperty({ default: 'Handex-də Data Analitika tədrisi, tələbələri real dünya problemlərini həll edəcək qlobal bilik və praktiki bacarıqlarla təchiz edən innovativ və təcrübə yönümlü proqramdır.' })
    course_detail: string;

    @Type()
    @IsEnum(Lang)
    @ApiProperty({ default: Lang.AZ })
    lang: Lang;
}

export class CreateProgramTranslationsDto {
    @Type()
    @IsString()
    @ApiProperty({ default: 'Handex-də Data Analitika tədrisi, tələbələri real dünya problemlərini həll edəcək qlobal bilik və praktiki bacarıqlarla təchiz edən innovativ və təcrübə yönümlü proqramdır.' })
    description: string;

    @Type()
    @IsEnum(Lang)
    @ApiProperty({ default: Lang.AZ })
    lang: Lang;
}

export class CreateProgramDto {
    @Type()
    @IsString()
    @ApiProperty({ default: '5 ay, həftədə 3 dəfə' })
    name: string;

    @Type(() => CreateProgramTranslationsDto)
    @IsArray()
    @ApiProperty({ type: [CreateProgramTranslationsDto] })
    translations: CreateProgramTranslationsDto[];
}

export class CreateFaqTranslationsDto {
    @Type()
    @IsString()
    @ApiProperty({ default: 'title' })
    title: string;

    @Type()
    @IsString()
    @ApiProperty({ default: 'Xeber1' })
    description: string;

    @Type()
    @IsEnum(Lang)
    @ApiProperty({ default: Lang.AZ })
    lang: Lang;
}

export class CreateStudyAreaDto {
    @Type()
    @IsString()
    @ApiProperty({ default: 'Back-end' })
    name: string;

    @Type()
    @IsString()
    @ApiProperty({ default: 'back-end' })
    slug: string;

    @Type()
    @IsNumber()
    @ApiProperty({ default: 0 })
    image: number;

    @Type(() => CreateStudyAreaTranslationsDto)
    @IsArray()
    @ApiProperty({ type: [CreateStudyAreaTranslationsDto] })
    translations: CreateStudyAreaTranslationsDto[];

    @Type(() => CreateFaqTranslationsDto)
    @IsArray()
    @ApiProperty({ type: [CreateFaqTranslationsDto] })
    faq: CreateFaqTranslationsDto[];

    @Type(() => CreateProgramDto)
    @IsArray()
    @ApiProperty({ type: [CreateProgramDto] })
    program: CreateProgramDto[];
}