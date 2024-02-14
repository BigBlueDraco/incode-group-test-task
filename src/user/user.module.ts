import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
