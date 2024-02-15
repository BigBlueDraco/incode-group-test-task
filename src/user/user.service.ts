import {
  BadRequestException,
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
  async checkUserCanBeBossOfUser(id: number, bossId: number) {
    if (
      (await this.findSubordinates(id)).filter((elem) => elem.id == bossId)
        .length > 0
    ) {
      throw new BadRequestException(
        'A user cannot be the boss of this user because he is already his subordinate',
      );
    }
  }
  async update(id: number, updateUser: UpdateUser): Promise<ResponseUser> {
    try {
      const exUser = await this.findOne({ id });
      if (
        Object.keys(updateUser).includes('bossId') &&
        updateUser.bossId != null
      ) {
        if (id == updateUser.bossId) {
          throw new BadRequestException("User id and boss id can't be equels");
        }

        await this.checkUserCanBeBossOfUser(id, updateUser.bossId);
        const boss = await this.findOne({
          id: updateUser.bossId,
        });
        const { BOSS, ADMIN } = $Enums.Role;
        if (boss.role !== `${ADMIN}` && exUser.role == 'ADMIN') {
          throw new ConflictException('Admin can be subordinate only by admin');
        }
        if (
          boss.role != `${BOSS}` &&
          boss.role != `${ADMIN}` &&
          !(updateUser.role === `${ADMIN}`)
        ) {
          updateUser = { ...updateUser, role: BOSS };
        }
      }
      const {
        password,
        boss: { password: bossPassword, ...boss },
        ...user
      } = await this.prismaService.user.update({
        where: { id },
        data: updateUser,
        include: { subordinates: true, boss: true },
      });
      return {
        ...user,
        boss: boss ? boss : null,
      };
    } catch (err) {
      return err;
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

  async findSubordinates(id: number): Promise<ResponseUser[]> {
    try {
      await this.findOne({ id });
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
    } catch (err) {
      throw err;
    }
  }
  async changeRole(id: number, role: $Enums.Role) {
    try {
      const user = await this.findSubordinates(id);
      if (user.length > 1 && role == $Enums.Role.USER) {
        throw new ConflictException(
          `You can't set role ${$Enums.Role.USER} because User with id ${id} have subordinates`,
        );
      }
      return await this.update(id, { role });
    } catch (err) {
      return err;
    }
  }
  async changeBoss(id: number, bossId: number, currentBossId: number) {
    try {
      const subordinates = await this.findSubordinates(currentBossId);
      if (subordinates.filter((elem) => elem.id === id).length < 0) {
        throw new NotFoundException(
          `User with id: ${id} not found in your subordinates`,
        );
      }
      return await this.update(id, { bossId });
    } catch (err) {
      return err;
    }
  }
}
