import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles: Role[] = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    return this.matchRoles(roles, user.roles);
  }

  private matchRoles(roles: string[], userRoles: string[]): boolean {
    return roles.some((role) => userRoles.includes(role));
  }
}
