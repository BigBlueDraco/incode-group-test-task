import { Role } from '@prisma/client';

export interface UpdateUser {
  email?: string;
  password?: string;
  bossId?: number;
  role?: Role;
}
