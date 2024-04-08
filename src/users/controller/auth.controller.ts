import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dto/auth/sign-in.dto';

//TODO: refresh token 기능 추가 - redis 사용
//TODO: 로그아웃 기능 추가
@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  /**
   * NOTE: @Body SignInDto로 전달받지 않는 이유
   * - cuz: swagger의 OAuth2PasswordBearer 기능을 사용하기 위해 DTO로 전달 받지 않는다.
   * - DTO로 전달 받으면 `grant_type`으로 인식되어 swagger에서 테스트할 수 없다.
   */
  @Post('signin')
  @ApiBody({ type: SignInDto })
  async signIn(@Body() { username, password }) {
    this.logger.debug(`Signing in with ${username}, ${password}`);
    return this.authService.signIn(username, password);
  }

  /**
   * @description JWT 토큰 유효성 검사
   */
  @Post('verify')
  @ApiBearerAuth('OAuth2PasswordBearer')
  async verify(@Req() req: any) {
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;
    this.logger.debug(`verify token with ${token}`);
    return this.authService.verify(token);
  }
}
