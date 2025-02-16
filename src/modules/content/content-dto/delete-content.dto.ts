import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class DeleteAboutDto {
    @Type()
    @IsNumber()
    id: number
}