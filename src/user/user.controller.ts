import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ChangeBossDto } from './dto/change-boss.dto';
import { changeRoleDto } from './dto/change-role.dto';

@Controller('user')
@ApiTags('user')
@ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: [ResponseUserDto],
  })
  @Roles($Enums.Role.ADMIN)
  async findAll(): Promise<ResponseUserDto[]> {
    try {
      return (await this.userService.findAll()).map(
        ({ password, ...elem }) => ({ ...elem }),
      );
    } catch (err) {
      return err;
    }
  }

  @Get('/myself/subordinates')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: [ResponseUserDto],
  })
  @Roles($Enums.Role.ADMIN, $Enums.Role.BOSS)
  async findSubordinates(@AuthUser() user: any) {
    return await this.userService.findSubordinates(user.id);
  }

  @Get('/myself')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: [ResponseUserDto],
  })
  @Roles($Enums.Role.ADMIN, $Enums.Role.BOSS, $Enums.Role.USER)
  async findMyself(@AuthUser() user: any) {
    const { password, ...res } = await this.userService.findOne({
      id: +user.id,
    });
    return res;
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: ResponseUserDto,
  })
  @Roles($Enums.Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    try {
      const user = await this.userService.findOne({ id: +id });
      if (!user) {
        throw new NotFoundException();
      }
      const { password, ...res } = await this.userService.update(
        +id,
        updateUserDto,
      );
      return res;
    } catch (err) {
      return err;
    }
  }

  @Patch(':id/role')
  @Roles($Enums.Role.ADMIN)
  async changeRole(@Param('id') id: string, @Body() body: changeRoleDto) {
    return await this.userService.changeRole(+id, body.role);
  }

  @Patch(':id/boss')
  @Roles($Enums.Role.ADMIN, $Enums.Role.BOSS)
  async changeBoss(
    @Param('id') id: string,
    @Body() body: ChangeBossDto,
    @AuthUser() user,
  ): Promise<ResponseUserDto> {
    return await this.userService.changeBoss(+id, body.bossId, +user.id);
  }
}
