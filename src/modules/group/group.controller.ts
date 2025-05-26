import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GroupService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";

@Controller('group')
export class GroupController {
    constructor(
        private groupService: GroupService
    ) { }

    @Get(':studyAreaId')
    async list(@Param('studyAreaId') studyAreaId: number) {
        return await this.groupService.list(studyAreaId);
    }

    @Post()
    async create(@Body() body: CreateGroupDto) {
        return await this.groupService.create(body);
    }

    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateGroupDto) {
        return await this.groupService.update(id, body);
    }
}