import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { jwtConstants } from 'config/envs/secrets/jwt.constants';
import * as jwt from 'jsonwebtoken';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Authorization token not found.');
    }

    try {
      const decoded = jwt.verify(token, jwtConstants.secret);
      return decoded;
    } catch (error) {
      throw new Error('Token verification failed.');
    }
  },
);
