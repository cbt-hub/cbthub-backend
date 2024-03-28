import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'config/envs/secrets/jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user || user.deletedAt !== null) {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(pass, user.password);
    if (passwordsMatch) {
      return user;
    }

    return null;
  }

  async signIn(username, password) {
    const result = await this.validateUser(username, password);
    if (!result) {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }

    if (result.deletedAt) {
      throw new UnauthorizedException('탈퇴한 회원입니다.');
    }

    const payload = {
      username: result.username,
      sub: result.userId,
      uuid: result.uuid,
      role: result.role,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }
}
