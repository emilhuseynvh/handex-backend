import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateAboutPageDto } from "./create-about.dto";
import { Type } from "class-transformer";
import { IsArray } from "class-validator";

export class UpdateAboutPageDto {
    @Type()
    @IsArray()
    @ApiProperty({ default: [1] })
    images: number[];
}