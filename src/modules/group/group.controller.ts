import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { GroupService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { Auth } from "src/shares/decorators/auth.decorator";

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
    @Auth()
    async create(@Body() body: CreateGroupDto) {
        return await this.groupService.create(body);
    }

    @Post(':id')
    @Auth()
    async update(@Param('id') id: number, @Body() body: UpdateGroupDto) {
        return await this.groupService.update(id, body);
    }

    @Delete(':id')
    @Auth()
    async delete(@Param('id') id: number) {
        return await this.groupService.delete(id);
    }
}