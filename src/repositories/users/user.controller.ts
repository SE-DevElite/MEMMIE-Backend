import { UserService } from './user.service';
import { createUserDto, getUserByIdDto } from '@/interfaces/IUserRequest';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserResponse } from '@/common/user_response.common';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param() params: getUserByIdDto) {
    const res = await this.userService.getUserById(params.id);

    if (!res) {
      return new UserResponse('User not found', false, null);
    }

    return new UserResponse('User found', true, res);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() req: createUserDto) {
    const res = await this.userService.createUserByEmailAndPassword(
      req.email,
      req.password,
      'local',
    );

    if (!res) {
      return new UserResponse('User not created', false, null);
    }

    return new UserResponse('User created', true, res);
  }
}
