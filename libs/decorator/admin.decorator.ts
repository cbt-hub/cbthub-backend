import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleGuard } from 'libs/lifecycle/guard/role.guard';
import { Roles } from './role.decorator';
import { RoleEnum } from '@src/users/entities/user.entity';
import { Auth } from './auth.decorator';

export function Admin() {
  return applyDecorators(
    Auth(), // 여기에 Auth 데코레이터를 추가하여 자동으로 인증 절차가 포함되도록 합니다.
    UseGuards(RoleGuard),
    Roles(RoleEnum.ADMIN),
  );
}
