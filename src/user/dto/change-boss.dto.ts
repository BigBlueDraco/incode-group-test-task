import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class ChangeBossDto extends PickType(UpdateUserDto, [
  'bossId',
] as const) {}
