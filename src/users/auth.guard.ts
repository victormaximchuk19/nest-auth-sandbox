import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC } from 'src/decorators/public-route.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }

  async validateRequest(req: any) {
    const { headers } = req;

    // get bearer token from `Authorization` header.
    const token = headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      req.user = await this.authService.checkSession(token);
    } catch (ex) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
