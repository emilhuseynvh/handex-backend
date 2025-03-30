import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfilesEntity } from "src/entities/profile.entity";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";

@Module({
    imports: [TypeOrmModule.forFeature([ProfilesEntity])],
    controllers: [ProfilesController],
    providers: [ProfilesService]
})
export class ProfilesModule { }