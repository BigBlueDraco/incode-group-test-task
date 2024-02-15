import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const jwtService = new JwtService();

    const req = ctx.switchToHttp().getRequest();
    const token = `${req.headers['authorization']}`.split(' ')[1];

    const secret = env.JWT_SECRET;
    const payload = jwtService.verify(token, {
      secret: secret,
    });
    const { iat, exp, ...user } = payload;
    return user;
  },
);
