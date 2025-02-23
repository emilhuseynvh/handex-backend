import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class CreateStatisticsDto {
    @Type()
    @IsNumber()
    @Min(1)
    @ApiProperty({default: 1})
    certificates: number

    @Type()
    @IsNumber()
    @Min(1)
    @ApiProperty({default: 1})
    stutends: number 

    @Type()
    @IsNumber()
    @Min(1)
    @ApiProperty({default: 1})
    graduates: number 

    @Type()
    @IsNumber()
    @Min(1)
    @ApiProperty({default: 1})
    workers: number 

    @Type()
    @IsNumber()
    @Min(1)
    @ApiProperty({default: 1})
    teachers: number 

}