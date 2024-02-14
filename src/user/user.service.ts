import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { User } from '@prisma/client';
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

  async findAll(): Promise<ResponseUser[]> {
    try {
      return await this.prismaService.user.findMany({
        include: { subordinates: true, boss: true },
      });
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number): Promise<ResponseUser> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        include: { subordinates: true, boss: true },
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
      await this.findOne(id);
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
      await this.findOne(id);
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (err) {
      throw err;
    }
  }
}
