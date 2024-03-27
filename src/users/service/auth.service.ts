import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { SignInDto } from '../dto/auth/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'config/envs/secrets/jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || user.deletedAt !== null) {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(pass, user.password);
    if (passwordsMatch) {
      return user;
    }

    return null;
  }

  async signIn(user: SignInDto) {
    const result = await this.validateUser(user.email, user.password);
    if (!result) {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }
    const payload = { email: result.email, sub: result.userId };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }
}
