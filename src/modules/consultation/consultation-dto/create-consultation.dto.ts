import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, Matches } from "class-validator";

export class CreateConsultationDto {
    @Type()
    @IsString()
    @ApiProperty({ default: 'John' })
    name: string;

    @Type()
    @IsString()
    @ApiProperty({ default: 'Doe' })
    surname: string;

    @Type()
    @Matches(/^\+994\d{9}$/)
    @ApiProperty({ default: '+994505005050' })
    phone: string;

    @Type()
    @IsNumber()
    @ApiProperty({ default: 1 })
    course: number;
}