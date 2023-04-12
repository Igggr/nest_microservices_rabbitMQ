import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HasRoleGuard } from './has-role-guard';

@Injectable()
export class SameUserOrHasRoleGuard extends HasRoleGuard {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  check(req, user, requiredRoles: string[]) {
    return this.sameUser(req, user) || super.check(req, user, requiredRoles);
  }

  sameUser(req, user): boolean {
    const userId = +req.params.userId;
    if (user.id === userId) {
      return true;
    }
    return false;
  }
}
