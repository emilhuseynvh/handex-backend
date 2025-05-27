import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { Lang } from "src/shares/enums/lang.enum";

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
    @ApiProperty({ default: 'Back-end' })
    name: string;

    @Type()
    @IsNumber()
    @ApiProperty({ default: 1 })
    image: number;

    @Type(() => CreateProgramTranslationsDto)
    @IsArray()
    @ApiProperty({ type: [CreateProgramTranslationsDto] })
    translations: CreateProgramTranslationsDto[];

    @Type()
    @IsNumber()
    @ApiProperty({ default: 0 })
    studyArea: number;
}