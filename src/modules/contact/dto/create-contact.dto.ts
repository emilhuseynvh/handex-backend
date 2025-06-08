import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
    @Type()
    @IsString({ message: 'contact.full_name.isString' })
    @MinLength(1, { message: 'contact.full_name.minLength' })
    @ApiProperty({ default: 'Emil Huseynov' })
    full_name: string;

    @Type()
    @IsEmail({}, { message: 'contact.email.isEmail' })
    @MinLength(1, { message: 'contact.email.minLength' })
    @ApiProperty({ default: 'emilhuseynvh@gmail.com' })
    email: string;

    @Type()
    @IsString({ message: 'contact.phone.isString' })
    @MinLength(1, { message: 'contact.phone.minLength' })
    @ApiProperty({ default: '+994504062435' })
    phone: string;

    @Type()
    @IsString({ message: 'contact.title.isString' })
    @MinLength(1, { message: 'contact.title.minLength' })
    @ApiProperty({ default: 'title' })
    title: string;

    @Type()
    @IsString({ message: 'contact.message.isString' })
    @MinLength(1, { message: 'contact.message.minLength' })
    @ApiProperty({ default: 'message' })
    message: string;
}
