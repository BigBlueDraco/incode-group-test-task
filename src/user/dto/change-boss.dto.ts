import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class cahangeBossDto extends PickType(UpdateUserDto, [
  'bossId',
] as const) {}
