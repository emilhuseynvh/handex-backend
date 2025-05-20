import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateContactDto {
    @Type()
    @IsString()
    @MinLength(1)
    @ApiProperty({ default: 'Emil Huseynov' })
    full_name: string;

    @Type()
    @IsEmail()
    @MinLength(1)
    @ApiProperty({ default: 'emilhuseynvh@gmail.com' })
    email: string;


    @Type()
    @IsString()
    @MinLength(1)
    @ApiProperty({ default: '+994504062435' })
    phone: string;

    @Type()
    @IsString()
    @MinLength(1)
    @ApiProperty({ default: 'title' })
    title: string;

    @Type()
    @IsString()
    @MinLength(1)
    @ApiProperty({ default: 'message' })
    message: string;
}