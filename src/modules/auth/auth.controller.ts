import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./auth-dto/register-auth.dto";
import { LoginAuthDto } from "./auth-dto/login-auth.dto";
import { Auth } from "src/shares/decorators/auth.decorator";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('register')
    @Auth()
    async register(@Body() body: RegisterAuthDto) {
        return await this.authService.register(body);
    }

    @Get('verify-token')
    @Auth()
    async verifyToken() {
        return { status: true };
    }

    @Post('login')
    async login(@Body() body: LoginAuthDto) {
        return await this.authService.login(body);
    }
}