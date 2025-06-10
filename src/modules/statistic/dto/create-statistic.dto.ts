import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { Lang } from "src/shares/enums/lang.enum";

class CreateStatisticTranslationsDto {
  @ApiProperty({ enum: Lang })
  @IsEnum(Lang)
  lang: Lang;

  @ApiProperty({ default: 'Example value' })
  @IsString()
  value: string;
}

export class CreateStatisticDto {
  @ApiProperty({ default: '0' })
  @IsString()
  count: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  studyArea: number;

  @ApiProperty({ default: 'home' })
  @IsString()
  field: string;

  @ApiProperty({ type: () => CreateStatisticTranslationsDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStatisticTranslationsDto)
  translations: CreateStatisticTranslationsDto[];
}
