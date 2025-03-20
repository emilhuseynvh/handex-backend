import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralEntity } from "src/entities/general.entity";
import { GeneralController } from "./general.controller";
import { GeneralService } from "./general.service";

@Module({
    imports: [TypeOrmModule.forFeature([GeneralEntity])],
    controllers: [GeneralController],
    providers: [GeneralService]
})
export class GeneralModule { }