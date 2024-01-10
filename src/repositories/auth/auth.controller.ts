import { AuthService } from './auth.service';
import { IServiceRequest, SigninDto } from '@/interfaces/IAuthRequest';
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
  Req,
} from '@nestjs/common';
import { AuthenGuard } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('/facebook')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: IServiceRequest): Promise<any> {
    const access_token = await this.authService.createOrLoginFacebookUser(
      req.user.email,
      'facebook',
    );

    return new AuthResponse('Login success', false, access_token);
  }

  @Get('/google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/google/redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req: IServiceRequest): Promise<any> {
    const access_token = await this.authService.createOrLoginFacebookUser(
      req.user.email,
      'google',
    );

    return new AuthResponse('Login success', false, access_token);
  }
}
