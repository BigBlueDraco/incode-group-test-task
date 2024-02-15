import { $Enums, Role, User } from '@prisma/client';
import { ResponseUser } from '../interfaces/response-user.interface';
import { ApiProperty } from '@nestjs/swagger';
export class ResponseUserDto implements ResponseUser {
  @ApiProperty({
    description: 'User id',
    example: 1,
    type: Number,
  })
  id: number;
  @ApiProperty({
    description: 'User id of boos',
    type: Number,
    example: 2,
  })
  bossId: number;
  @ApiProperty({
    description: 'User role',
    type: $Enums.Role,
    enum: [Role.ADMIN, Role.USER, Role.BOSS],
    example: Role.USER,
  })
  role: $Enums.Role;
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'mail@example.com',
  })
  email: string;
}
