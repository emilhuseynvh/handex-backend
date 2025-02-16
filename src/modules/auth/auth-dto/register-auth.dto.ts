import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class RegisterAuthDto {
    @Type()
    @IsString()
    @ApiProperty({ default: 'johndoe' })
    username: string;

    @Type()
    @ApiProperty({ default: 123456 })
    @MinLength(1)
    password: string;
}