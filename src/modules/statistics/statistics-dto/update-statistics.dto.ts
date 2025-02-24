import { PartialType } from "@nestjs/swagger"

import { CreateStatisticsDto } from "./create-statistics.dto"

export class UpdateStatisticsDto extends PartialType(CreateStatisticsDto) { }