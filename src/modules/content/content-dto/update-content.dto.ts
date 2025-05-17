import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, MinLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({ required: true, default: 'az' })
    lang: Lang;
}

export class UpdateContentDto {
    @Type(() => UpdateContentTranslationsDto)
    @IsOptional()
    @ApiProperty({ type: UpdateContentTranslationsDto, isArray: true, required: false })
    translations?: UpdateContentTranslationsDto[];

    @Type()
    @IsOptional()
    @IsNumber({}, { each: true })
    @ApiProperty({ required: false, default: 1 })
    images?: UploadEntity[];
}