import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Lang } from "src/shares/enums/lang.enum";
import { SideEnum } from "src/shares/enums/side.enum";

export class CreateSideTranslationsDto {
    @IsString()
    @ApiProperty({ example: 'Biz kimik?' })
    value: string;

    @IsEnum(Lang)
    @ApiProperty({ enum: Lang, example: Lang.AZ })
    lang: Lang;
}

export class CreateSideDto {
    @IsEnum(SideEnum)
    @ApiProperty({ enum: SideEnum, example: SideEnum.TEXT })
    type: SideEnum;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSideTranslationsDto)
    @IsOptional()
    @ApiProperty({
        type: [CreateSideTranslationsDto],
        example: [
            { value: 'Biz kimik?', lang: Lang.AZ },
            { value: 'Who are we?', lang: Lang.EN }
        ]
    })
    translations: CreateSideTranslationsDto[];

    @Type()
    @IsString()
    @IsOptional()
    @ApiProperty({ default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNOgLhqXxde3degdRNogL9Jtzh1We7TTxErQ&s' })
    url: string;
}

export class CreateSectionDto {
    @ValidateNested()
    @Type(() => CreateSideDto)
    @ApiProperty({ type: CreateSideDto })
    left_side: CreateSideDto;

    @ValidateNested()
    @Type(() => CreateSideDto)
    @ApiProperty({ type: CreateSideDto })
    right_side: CreateSideDto;
}

export class CreateAboutPageDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSectionDto)
    @ApiProperty({
        type: [CreateSectionDto],
        description: 'An array of sections, each with left and right sides'
    })
    sections: CreateSectionDto;

    @Type()
    @IsArray()
    @ApiProperty({ default: [1] })
    images: number[];
}