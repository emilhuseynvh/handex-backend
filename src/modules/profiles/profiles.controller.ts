import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ProfilesService } from "./profiles.service";
import { ApiQuery } from "@nestjs/swagger";
import { CreateProfilesDto } from "./dto/create-profiles.dto";
import { Auth } from "src/shares/decorators/auth.decorator";
import { UpdateProfilesDto } from "./dto/update-profiles.dto";

@Controller('profiles')
export class ProfilesController {
    constructor(
        private profilesService: ProfilesService
    ) { }

    @Get()
    @ApiQuery({ name: 'model' })
    async list(@Query('model') model: string) {
        return await this.profilesService.list(model);
    }

    @Auth()
    @Post()
    async create(@Body() body: CreateProfilesDto) {
        return await this.profilesService.create(body);
    }

    @Auth()
    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateProfilesDto) {
        return await this.profilesService.update(id, body);
    }

    @Auth()
    @Delete(':id')
    async deleteProfile(@Param('id') id: number) {
        return await this.profilesService.deleteProfile(id);
    }
}