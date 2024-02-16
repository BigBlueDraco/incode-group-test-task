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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ChangeBossDto } from './dto/change-boss.dto';
import { changeRoleDto } from './dto/change-role.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse()
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
  @ApiOperation({ description: 'Return all users. Alow only for ADMIN user' })
  @Roles($Enums.Role.ADMIN)
  async findAll(): Promise<ResponseUserDto[]> {
    try {
      return (await this.userService.findAll()).map(
        // eslint-disable-next-line
        ({ password, ...elem }) => ({ ...elem }),
      );
    } catch (err) {
      return err;
    }
  }

  @Get('/myself')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: [ResponseUserDto],
    description: 'Return user base on JWT token',
  })
  @ApiOperation({
    description: 'Return your user information based on your JWT',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Roles($Enums.Role.ADMIN, $Enums.Role.BOSS, $Enums.Role.USER)
  async findMyself(@AuthUser() user: any) {
    // eslint-disable-next-line
    const { password, ...res } = await this.userService.findOne({
      id: +user.id,
    });
    return res;
  }

  @Get('/myself/subordinates')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: [ResponseUserDto],
    description: 'Return user and his subordinates base on JWT token',
  })
  @ApiOperation({
    description:
      'Return your user information and your subordinates based on your JWT',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Roles($Enums.Role.ADMIN, $Enums.Role.BOSS)
  async findSubordinates(@AuthUser() user: any) {
    return await this.userService.findSubordinates(user.id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: "User id and boss id can't be equels" })
  @ApiConflictResponse({
    description: 'Admin can be subordinate only by admin',
  })
  @ApiOperation({ description: 'Update user by id. Alow only for ADMIN user' })
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
      // eslint-disable-next-line
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
  @ApiResponse({
    status: 200,
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({
    description:
      "You can't set role USER because User with id ${id} have subordinates",
  })
  @ApiOperation({
    description: 'Change role for user. Alow only for ADMIN user',
  })
  async changeRole(@Param('id') id: string, @Body() body: changeRoleDto) {
    return await this.userService.changeRole(+id, body.role);
  }

  @Patch(':id/boss')
  @ApiResponse({
    status: 200,
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: "User id and boss id can't be equels" })
  @ApiConflictResponse({
    description: 'Admin can be subordinate only by admin',
  })
  @ApiOperation({
    description: 'Change boss for user. Alow only for ADMIN and BOSS users',
  })
  @Roles($Enums.Role.ADMIN, $Enums.Role.BOSS)
  async changeBoss(
    @Param('id') id: string,
    @Body() body: ChangeBossDto,
    @AuthUser() user,
  ): Promise<ResponseUserDto> {
    try {
      return await this.userService.changeBoss(+id, body.bossId, +user.id);
    } catch (err) {
      return err;
    }
  }
}
