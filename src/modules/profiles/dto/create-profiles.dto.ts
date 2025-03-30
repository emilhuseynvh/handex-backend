import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

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
    
    @Type()
    @IsNumber()
    @ApiProperty({ default: 0 })
    image: number;
}