import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Lang } from "src/shares/enums/lang.enum";
import { CreateMetaTranslationsDto } from "./create-meta.dto";

export class UpdateMetaDto {
    @Type(() => CreateMetaTranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: CreateMetaTranslationsDto, isArray: true })
    translations: CreateMetaTranslationsDto[];
}