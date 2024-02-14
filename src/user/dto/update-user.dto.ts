import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UpdateUser } from '../interfaces/update-user.interface';

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements UpdateUser {}
