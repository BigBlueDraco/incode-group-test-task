import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';

@Controller('user')
@ApiTags('user')
@ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: [ResponseUserDto],
  })
  async findAll(): Promise<ResponseUserDto[]> {
    try {
      return await this.userService.findAll();
    } catch (err) {
      return err;
    }
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    try {
      return await this.userService.findOne(+id);
    } catch (err) {
      return err;
    }
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: ResponseUserDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    try {
      return await this.userService.update(+id, updateUserDto);
    } catch (err) {
      return err;
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ResponseUserDto,
  })
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(+id);
    } catch (err) {
      return err;
    }
  }
}
