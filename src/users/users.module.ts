import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
