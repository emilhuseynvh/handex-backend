import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./auth-dto/register-auth.dto";
import { LoginAuthDto } from "./auth-dto/login-auth.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('register')
    async register(@Body() body: RegisterAuthDto) {
        return await this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: LoginAuthDto) {
        return await this.authService.login(body);
    }
}