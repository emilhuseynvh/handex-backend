import { PartialType } from "@nestjs/swagger";
import { CreateSectionDto } from "src/modules/about/dto/create-about.dto";

export class UpdateSectionDto extends PartialType(CreateSectionDto) { }