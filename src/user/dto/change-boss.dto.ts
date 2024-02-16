import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';
import { NotEquals, ValidateIf } from 'class-validator';

export class ChangeBossDto extends PickType(UpdateUserDto, [
  'bossId',
] as const) {
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  bossId?: number;
}
