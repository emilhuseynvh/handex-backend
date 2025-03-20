import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsInt, IsNumber, IsObject, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { UploadEntity } from "src/entities/upload.entity";


export class CreateGeneralDto {
    @Type()
    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ isArray: true })
    @IsOptional()
    phone: string[];

    @Type()
    @IsString()
    @MinLength(6)
    @ApiProperty({ default: 'Matbuat street 25' })
    @IsOptional()
    location: string;

    @Type()
    @IsEmail()
    @ApiProperty({ default: 'emil@apasni.me' })
    @IsOptional()
    email: string;

    @Type()
    @IsArray()
    @IsInt({ each: true })
    @ApiProperty({ isArray: true })
    @IsOptional()
    company: number[];

    @IsObject()
    @IsOptional()
    statistics: {
            certificates: number;
            students: number;
            teachers: number;
            workers: number;
    };
}