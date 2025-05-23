import { Module } from "@nestjs/common";
import { RedirectController } from "./redirect.controller";
import { RedirectService } from "./redirect.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedirectEntity } from "src/entities/redirect.entity";

@Module({
    imports: [TypeOrmModule.forFeature([RedirectEntity])],
    controllers: [RedirectController],
    providers: [RedirectService]
})
export class RedirectModule { }