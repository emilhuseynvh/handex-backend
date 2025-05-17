import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: string;

  @Type()
  @IsOptional()
  @ApiProperty({ default: 'ALT text' })
  alt: string;

}
