import { PartialType } from "@nestjs/swagger";
import { CreateAboutPageDto } from "./create-about.dto";

export class UpdateAboutPageDto extends PartialType(CreateAboutPageDto) { }