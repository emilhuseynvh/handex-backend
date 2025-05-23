import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsString, IsUrl } from "class-validator";

export class CreateRedirectDto {
    @Type()
    @IsString()
    @IsString()
    @ApiProperty({ default: 'handex.az' })
    from: string;
    
    @Type()
    @IsString()
    @ApiProperty({ default: 'handex.edu.az' })
    to: string;

    @Type()
    @IsBoolean()
    @ApiProperty({ default: true })
    isPermanent: boolean;
}