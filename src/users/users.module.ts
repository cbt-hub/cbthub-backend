import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './service/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
