import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, MinLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Lang } from 'src/shares/enums/lang.enum';
import { CreateMetaDto } from 'src/modules/meta/meta-dto/create-meta.dto';
import { UploadEntity } from 'src/entities/upload.entity';

export class UpdateContentTranslationsDto {
    @Type()
    @IsOptional()
    @ApiProperty({ required: false })
    title?: string;

    @Type()
    @IsOptional()
    @ApiProperty({ required: false })
    desc?: string;

    @Type()
    @ApiProperty({ required: true })
    lang: Lang;
}

export class UpdateContentDto {
    @Type(() => UpdateContentTranslationsDto)
    @IsOptional()
    @ValidateNested({ each: true })
    @ApiProperty({ type: UpdateContentTranslationsDto, isArray: true, required: false })
    translations?: UpdateContentTranslationsDto[];

    @Type()
    @IsOptional()
    @IsNumber({}, { each: true })
    @ApiProperty({ required: false })
    images?: UploadEntity[];

    @Type()
    @IsOptional()
    @IsArray()
    @ApiProperty({ required: false })
    meta?: CreateMetaDto[];
}