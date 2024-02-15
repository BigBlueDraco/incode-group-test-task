import { PickType } from '@nestjs/swagger';
import { ResponseUserDto } from './response-user.dto';
import { $Enums } from '@prisma/client';
import { UpdateUserDto } from './update-user.dto';

export class changeRoleDto extends PickType(UpdateUserDto, ['role'] as const) {}