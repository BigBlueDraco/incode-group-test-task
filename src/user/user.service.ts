import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { $Enums, Prisma, User } from '@prisma/client';
import { CreateUser } from './interfaces/create-user.interface';
import { UpdateUser } from './interfaces/update-user.interface';
import { ResponseUser } from './interfaces/response-user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUser: CreateUser): Promise<ResponseUser> {
    try {
      const exUser = await this.prismaService.user.findUnique({
        where: { email: createUser.email.toLocaleLowerCase() },
      });
      if (exUser) {
        throw new ConflictException(
          `User with email ${createUser.email.toLocaleLowerCase()} already exist`,
        );
      }
      const user = await this.prismaService.user.create({ data: createUser });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findAll(include?: unknown): Promise<ResponseUser[]> {
    try {
      return await this.prismaService.user.findMany({
        include,
      });
    } catch (err) {
      throw err;
    }
  }
  async findOne(
    where: Prisma.UserWhereUniqueInput,
    include?: unknown,
  ): Promise<ResponseUser> {
    try {
      const user = await this.prismaService.user.findUnique({
        where,
        include,
      });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateUser: UpdateUser): Promise<ResponseUser> {
    try {
      await this.findOne({ id });
      return await this.prismaService.user.update({
        where: { id },
        data: updateUser,
        include: { subordinates: true, boss: true },
      });
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number): Promise<ResponseUser> {
    try {
      await this.findOne({ id });
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (err) {
      throw err;
    }
  }

  async findSubordinates(id: number) {
    return await this.prismaService.$queryRaw`
    WITH RECURSIVE Subordinates AS (
      SELECT id, email, "bossId", "role"
      FROM "User"
      WHERE id = ${id}
      UNION ALL
      SELECT u.id, u.email, u."bossId", u."role"
      FROM "User" u
      INNER JOIN Subordinates s ON u."bossId" = s.id
    )
    SELECT id, email, "bossId", "role"
    FROM Subordinates;`;
  }
  async changeRole(id: number, role: $Enums.Role) {
    return await this.update(id, { role });
  }
}
