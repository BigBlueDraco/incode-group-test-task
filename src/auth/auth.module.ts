import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/service/prisma.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get<string>('JWT_LIFE_TIME'),
        },
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService],
})
export class AuthModule {}
