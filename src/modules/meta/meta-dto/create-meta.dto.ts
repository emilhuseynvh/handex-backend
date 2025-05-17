import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
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
    @ApiProperty({ required: true, default: 'az' })
    lang: Lang;
}

export class CreateMetaDto {
    @Type(() => CreateMetaTranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: CreateMetaTranslationsDto, isArray: true })
    translations: CreateMetaTranslationsDto[];

    @Type()
    @IsNumber()
    @IsOptional()
    @ApiProperty({default: 0})
    news: number

    @Type()
    @IsString()
    @IsOptional()
    @ApiProperty({default: 'home'})
    slug: string
}