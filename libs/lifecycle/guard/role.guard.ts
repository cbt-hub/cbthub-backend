import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  private logger = new Logger(RoleGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // 필요한 역할이 정의되지 않았다면, 접근을 허용합니다.
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.debug(`user: ${JSON.stringify(user)}`);

    return user.role === requiredRoles[0];
  }
}
