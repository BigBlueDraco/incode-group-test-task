import { $Enums, User } from '@prisma/client';
export class ResponseUser {
  id: number;
  password: string;
  bossId: number;
  role: $Enums.Role;
  email: string;
  subordinates?: User[];
  boss?: User;
}
