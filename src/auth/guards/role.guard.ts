import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { $Enums } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<$Enums.Role[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    const [req] = context.getArgs();
    const token = `${req.headers['authorization']}`.split(' ')[1];
    const secret = this.configService.get('JWT_SECRET');
    const payload = this.jwtService.verify(token, {
      secret: secret,
    });

    return requiredRoles.includes(payload.role);
  }
}
