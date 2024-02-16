import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class changeRoleDto extends PickType(UpdateUserDto, ['role'] as const) {}
