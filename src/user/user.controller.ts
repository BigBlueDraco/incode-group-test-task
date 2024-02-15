import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';

@Controller('user')
@ApiTags('user')
@ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: [ResponseUserDto],
  })
  @Roles($Enums.Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
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
  async findSubordinates(@AuthUser() user: any) {}

  @Get('/myself')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: [ResponseUserDto],
  })
  @Roles($Enums.Role.ADMIN, $Enums.Role.BOSS, $Enums.Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    try {
      const user = await this.userService.findOne({ id: +id });
      if (!user) {
        throw new NotFoundException();
      }
      return await this.userService.update(+id, updateUserDto);
    } catch (err) {
      return err;
    }
  }
}
