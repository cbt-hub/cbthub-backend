import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dto/auth/sign-in.dto';

//TODO: refresh token 기능 추가 - redis 사용
//TODO: 로그아웃 기능 추가
//TODO: swagger의 Authorization 기능 추가
@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiBody({ type: SignInDto })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
