import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../enums/user.enum';

export const Auth = () =>
  applyDecorators(UseGuards(AuthGuard), ApiBearerAuth());
