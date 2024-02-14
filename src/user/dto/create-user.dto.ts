import { $Enums } from '@prisma/client';
import { CreateUser } from '../interfaces/create-user.interface';
export class CreateUserDto implements CreateUser {
  password: string;
  bossId: number;
  role: $Enums.Role;
  email: string;
}
