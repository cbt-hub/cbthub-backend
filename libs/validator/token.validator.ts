import { jwtConstants } from 'config/envs/secrets/jwt.constants';
import * as jwt from 'jsonwebtoken';

/**
 * 토큰이 유효한지 검증하는 함수
 * @param token 검증할 토큰
 * @returns 토큰이 유효하면 true, 그렇지 않으면 false
 */
export function validateToken(token: string): boolean {
  try {
    const JWT_SECRET = jwtConstants.secret;
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}
