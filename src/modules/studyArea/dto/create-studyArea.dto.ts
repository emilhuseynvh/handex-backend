import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateFaqTranslationsDto } from "src/modules/faq/dto/create-faq.dto";
import { CreateGroupDto } from "src/modules/group/dto/create-group.dto";
import { CreateMetaDto } from "src/modules/meta/meta-dto/create-meta.dto";
import { Lang } from "src/shares/enums/lang.enum";

export class CreateStudyAreaTranslationsDto {
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
    @ApiProperty({ default: 'Backend' })
    name: string;

    @Type(() => CreateProgramTranslationsDto)
    @IsArray()
    @ApiProperty({ type: [CreateProgramTranslationsDto] })
    translations: CreateProgramTranslationsDto[];
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
    @IsString()
    @ApiProperty({ default: '#DE465D' })
    color: string;

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

    @Type(() => CreateMetaDto)
    @IsArray()
    @ApiProperty({ type: [CreateMetaDto] })
    meta: CreateMetaDto[];

    @Type(() => CreateGroupDto)
    @IsOptional()
    @IsArray()
    @ApiProperty({ type: [CreateGroupDto] })
    group: CreateGroupDto[];
}