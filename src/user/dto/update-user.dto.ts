import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UpdateUser } from '../interfaces/update-user.interface';
import { IsEnum, IsOptional } from 'class-validator';
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
  @IsOptional()
  bossId?: number;
  @ApiProperty({
    description: 'User role',
    type: $Enums.Role,
    enum: [Role.ADMIN, Role.USER, Role.BOSS],
    example: Role.USER,
  })
  @IsOptional()
  @IsEnum([Role.ADMIN, Role.USER, Role.BOSS])
  role: $Enums.Role;
}
