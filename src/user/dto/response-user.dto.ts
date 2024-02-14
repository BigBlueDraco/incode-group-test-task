import { $Enums, User } from '@prisma/client';
import { ResponseUser } from '../interfaces/response-user.interface';
export class ResponseUserDto implements ResponseUser {
  id: number;
  password: string;
  bossId: number;
  role: $Enums.Role;
  email: string;
  subordinates?: User[];
  boss?: User;
}
