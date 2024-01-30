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
  Res,
} from '@nestjs/common';
import { AuthenGuard } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RedirectUrl } from '@/decorator/redirect-url.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/checkToken')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async checkToken() {
    return new AuthResponse('Token is valid', false, null);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SigninDto): Promise<AuthResponse> {
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

  // @Get('/facebook')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard('facebook'))
  // async facebookLogin(): Promise<any> {
  //   return HttpStatus.OK;
  // }

  // @Get('/facebook/redirect')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard('facebook'))
  // async facebookLoginRedirect(@Req() req: IServiceRequest): Promise<any> {
  //   const access_token = await this.authService.createOrLoginUser(
  //     req.user.email,
  //     'facebook',
  //   );

  //   return new AuthResponse('Login success', false, access_token);
  // }

  @Get('/google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/google/redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(
    @Req() req: IServiceRequest,
    @RedirectUrl() redirectUrl: string,
    @Res() res,
  ): Promise<any> {
    const access_token = await this.authService.createOrLoginUser(
      req.user.email,
      req.user.displayName,
      req.user.picture,
      req.user.firstName,
      'google',
    );

    return res.redirect(
      302,
      `${process.env.FRONTEND_URL}/?access_token=${access_token}`,
    );
  }
}
