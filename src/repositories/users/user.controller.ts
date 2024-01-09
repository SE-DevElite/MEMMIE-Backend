import { UserService } from './user.service';
import IUserRequest from '@/interface/IUserRequest';
import { Body, Controller, Post } from '@nestjs/common';
import { UserResponse } from '@/common/user_response.common';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async getUserByEmail(@Body() req: IUserRequest) {
    const res = await this.userService.getUserByEmail(req.email);

    if (!res) {
      return new UserResponse('User not found', false, null);
    }
  }

  @Post('/create')
  async createUser(@Body() req: IUserRequest) {
    const res = await this.userService.createUserByEmailAndPassword(
      req.email,
      req.password,
    );

    if (!res) {
      return new UserResponse('User not created', false, null);
    }

    return new UserResponse('User created', true, res);
  }
}
