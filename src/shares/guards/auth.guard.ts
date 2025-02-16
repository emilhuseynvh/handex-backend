// import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import config from "src/config";
// import { UserService } from "src/module/user/user.service";

// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(
//         private jwtService: JwtService,
//         private userService: UserService,
//     ) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         let request = context.switchToHttp().getRequest();

//         let authorization = request.headers.authorization || '';

//         let token = authorization.split(' ')[1];


//         try {
//             let payload = this.jwtService.verify(token, { secret: config.jwtSecret }) || '';

//             if (!payload.userId) throw new Error();

//             let user = await this.userService.userById(payload.userId);

//             if (!user) throw new Error();
//             return true;
//         } catch (err) {
//             if (err instanceof ForbiddenException) {
//                 throw err;
//             }
//             console.log('salam');

//             throw new UnauthorizedException();
//         }
//     }

// }