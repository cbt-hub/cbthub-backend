import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './service/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'config/envs/secrets/jwt.constants';
import { JwtStrategy } from 'libs/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, JwtService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
