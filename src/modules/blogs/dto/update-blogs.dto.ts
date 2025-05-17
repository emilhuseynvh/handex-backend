import { PartialType } from "@nestjs/swagger";
import { CreateBlogsDto } from "./create-blogs.dto";

export class UpdateBlogsDto extends PartialType(CreateBlogsDto) {}