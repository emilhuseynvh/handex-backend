import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { RegisterAuthDto } from "./auth-dto/register-auth.dto";
import { I18nService } from "nestjs-i18n";
// import { I18nTranslations } from "src/generated/i18n.generated";
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from "./auth-dto/login-auth.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private i18n: I18nService,
        private jwt: JwtService
    ) { }

    async register(params: RegisterAuthDto) {
        let checkUser = await this.userRepo.find({ where: { username: params.username } });


        if (!checkUser) throw new ConflictException(this.i18n.t('error.errors.conflict'));

        let hashedPassword = await bcrypt.hash(params.password, 10);

        let user = this.userRepo.create({
            username: params.username,
            password: hashedPassword
        });

        this.userRepo.save(user);
        return user;
    }

    async login(params: LoginAuthDto) {
        let user: UserEntity = await this.userRepo.findOne({ where: { username: params.username } });

        if (!user) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        let checkPassword = await bcrypt.compare(params.password, user.password);

        if (!checkPassword) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        let token = this.jwt.sign({ userId: user.id });

        return {
            user,
            token
        };
    }
}