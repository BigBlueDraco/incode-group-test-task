import { Role } from '@prisma/client';

export class User {
  id: number;
  email: string;
  password: string;
  boss: User;
  subordinates: User[];
  role: Role;
}
