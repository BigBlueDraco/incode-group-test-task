import { $Enums } from '@prisma/client';
import { ResponseUserDto } from '../dto/response-user.dto';
export class ResponseUser {
  id: number;
  password?: string;
  bossId: number;
  role: $Enums.Role;
  email: string;
  boss?: ResponseUserDto;
}
