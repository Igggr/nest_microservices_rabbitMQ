import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class HasRoleGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();

    // Guard работает после Muddleware. Если можно было выставить пользовтеля -
    // JwtMiddleware уже сделала бы это

    if (!req.user) {
      return false; // у анонима роли быть не может
    }

    return this.check(req, req.user, requiredRoles);
  }

  check(req, user, requiredRoles: string[]): boolean {
    return user.roles.some((role) => requiredRoles.includes(role));
  }
}
