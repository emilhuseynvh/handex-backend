import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Lang } from 'src/shares/enums/lang.enum';

export class CreateGroupTextTranslationsDto {
    @ApiProperty({ example: 'Group Name' })
    @IsString()
    name: string;

    @ApiProperty({ enum: Lang, example: Lang.AZ })
    @IsEnum(Lang)
    lang: Lang;
}

export class CreateGroupTableTranslationsDto {
    @ApiProperty({ example: 'Table Name' })
    @IsString()
    name: string;

    @ApiProperty({ enum: Lang, example: Lang.AZ })
    @IsEnum(Lang)
    lang: Lang;
}

export class CreateGroupDto {
    @ApiProperty({ type: [CreateGroupTextTranslationsDto], })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateGroupTextTranslationsDto)
    text: CreateGroupTextTranslationsDto[];

    @ApiProperty({
        type: [CreateGroupTableTranslationsDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateGroupTableTranslationsDto)
    table: CreateGroupTableTranslationsDto[];

    @Type()
    @ApiProperty({ default: '28May' })
    @IsString()
    startDate: string;

    @Type()
    @ApiProperty({ default: 1 })
    @IsNumber()
    studyArea: number;
}
