import { UserService } from './user.service';
import { ParamsUserDto, BodyUserDto } from '@/interfaces/IUserRequest';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserResponse } from '@/common/user_response.common';
import { AuthenGuard } from '../auth/auth.guard';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenGuard)
  async getUserById(@Param() params: ParamsUserDto): Promise<UserResponse> {
    const res = await this.userService.getUserById(params.id);

    if (!res) {
      return new UserResponse('User not found', true, null);
    }

    return new UserResponse('User found', false, res);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() req: BodyUserDto): Promise<UserResponse> {
    const res = await this.userService.createUserByEmailAndPassword(
      req.email,
      req.password,
      'local',
    );

    if (!res) {
      return new UserResponse('User not created', true, null);
    }

    return new UserResponse('User created', false, res);
  }

  @Patch(':id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param() params: ParamsUserDto,
    @Body() req: BodyUserDto,
  ): Promise<UserResponse> {
    const res = await this.userService.updateUser(params.id, req);

    if (!res) {
      return new UserResponse('User not updated', true, null);
    }

    return new UserResponse('User updated', false, res);
  }
}
