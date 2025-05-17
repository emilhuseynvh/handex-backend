import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateMetaDto } from "src/modules/meta/meta-dto/create-meta.dto";
import { Lang } from "src/shares/enums/lang.enum";

class CreateBlogsTranslationsDto {
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

export class CreateBlogsDto {
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ default: 1 })
    image: number;

    @Type()
    @IsString()
    @ApiProperty({ default: 'slug' })
    slug: string

    @Type(() => CreateBlogsTranslationsDto)
    @IsArray()
    @ApiProperty({ type: [CreateBlogsTranslationsDto] })
    translations: CreateBlogsTranslationsDto[];

    @Type(() => CreateMetaDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [CreateMetaDto] })
    meta: CreateMetaDto[];
}