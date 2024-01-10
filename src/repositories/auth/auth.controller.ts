import { AuthService } from './auth.service';
import { SigninDto } from '@/interfaces/IAuthRequest';
import { AuthResponse } from '@/common/auth_response.common';
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SigninDto) {
    const access_token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    if (!access_token) {
      return new AuthResponse('Invalid email or password', true, null);
    }

    return new AuthResponse('Login success', false, access_token);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req) {
    return req.user;
  }
}
