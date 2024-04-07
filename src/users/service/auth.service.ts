import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'config/envs/secrets/jwt.constants';
import * as jwt from 'jsonwebtoken';

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

  /**
   * @description JWT 토큰 유효성 검사
   */
  async verify(accessToken: string): Promise<any> {
    try {
      // jwt.verify 메서드를 사용하여 토큰 검증
      const decoded = jwt.verify(accessToken, jwtConstants.secret);
      return { valid: true, decoded };
    } catch (error) {
      // 유효하지 않은 경우 에러 처리
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다.');
    }
  }
}
