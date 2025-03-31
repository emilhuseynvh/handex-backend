import { PartialType } from "@nestjs/swagger";
import { CreateStudyAreaDto } from "./create-studyArea.dto";

export class UpdateStudyAreaDto extends PartialType(CreateStudyAreaDto) {}