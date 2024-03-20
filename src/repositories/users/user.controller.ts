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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserResponse, ManyUserResponse } from '@/common/user_response.common';
import { AuthenGuard } from '../auth/auth.guard';
import { IJWT } from '@/interfaces/IAuthRequest';
import { QueryParamsUserDto } from './dto/get-users';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenGuard)
  async getUsers(
    @Query() query: QueryParamsUserDto,
  ): Promise<ManyUserResponse> {
    const res = await this.userService.getUsers(query);

    if (!res) {
      return new ManyUserResponse('User not found', true, null, 0);
    }

    return new ManyUserResponse('User found', false, res, 0);
  }

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenGuard)
  async getUserProfile(@Req() req): Promise<UserResponse> {
    const user_data = req.user as IJWT;
    const { user, streak } = await this.userService.getUserProfile(
      user_data.user_id,
    );

    if (!user) {
      return new UserResponse('User not found', true, null, 0);
    }
    return new UserResponse('User found', false, user, streak);
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
      return new UserResponse('User not updated', true, null, 0);
    }

    return new UserResponse('User updated', false, res, 0);
  }
}
