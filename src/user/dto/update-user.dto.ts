import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UpdateUser } from '../interfaces/update-user.interface';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { $Enums, Role } from '@prisma/client';

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements UpdateUser
{
  @ApiProperty({
    description: 'User id of boos',
    type: Number,
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  bossId?: number;
  @ApiProperty({
    description: 'User role',
    type: $Enums.Role,
    enum: Role,
    example: Role.USER,
  })
  @IsOptional()
  @IsEnum(Role)
  role: $Enums.Role;
}
