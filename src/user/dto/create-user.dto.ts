import { Role } from '@prisma/client';
import { CreateUser } from '../interfaces/create-user.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
// enum Role
export class CreateUserDto implements CreateUser {
  @ApiProperty({
    description: 'email',
    example: 'mail@example.com',
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'Password',
    example: 'password123123123',
    type: String,
  })
  @IsString()
  password: string;
  @ApiProperty({
    description: 'BossId is id of boss user',
    example: 1,
    type: Number,
  })
  @IsOptional()
  bossId: number;
  @ApiProperty({
    description: 'Role',
    example: 'USER',
    default: 'USER',
    type: [Role.ADMIN, Role.BOSS, Role.USER],
  })
  @IsEnum(Role)
  role: Role;
}
