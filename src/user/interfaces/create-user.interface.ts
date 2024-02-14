import { Role } from '@prisma/client';
import { UpdateUser } from './update-user.interface';

export interface CreateUser extends UpdateUser {
  email: string;
  password: string;
  bossId: number;
  role: Role;
}
