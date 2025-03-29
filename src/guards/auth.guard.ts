import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { UserService } from 'src/modules/user/user.service';
import { UserRole } from 'src/shares/enums/user.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private cls: ClsService,
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    let token = request.headers.authorization || '';
    token = token.split(' ')[1];

    if (!token) throw new UnauthorizedException('unaouthorized');

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.getUser(payload.userId);
      if (!user) throw new Error();

      request['user'] = user;
      this.cls.set('user', user);
      return true;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
