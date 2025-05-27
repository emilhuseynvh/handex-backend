import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { Lang } from "src/shares/enums/lang.enum";

class CreateProfileTranslationDto {
    @Type()
    @IsString()
    @ApiProperty({ default: 'Lorem ipsum' })
    description: string;

    @Type()
    @IsEnum(Lang)
    @ApiProperty({ default: Lang.AZ })
    lang: Lang;
}

export class CreateProfilesDto {
    @Type()
    @IsString()
    @ApiProperty({ default: "Emil" })
    name: string;

    @Type()
    @IsString()
    @ApiProperty({ default: "Full-Stack" })
    speciality: string;

    @Type()
    @IsString()
    @ApiProperty({ default: "İnstruktur" })
    model: string;

    @Type(() => CreateProfileTranslationDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [CreateProfileTranslationDto] })
    translations: CreateProfileTranslationDto[];

    @Type()
    @IsNumber()
    @ApiProperty({ default: 0 })
    image: number;
}