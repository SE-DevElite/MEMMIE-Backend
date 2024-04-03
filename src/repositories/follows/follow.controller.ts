import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthenGuard } from '../auth/auth.guard';
import { IJWT } from '@/interfaces/IAuthRequest';
import { BodyFollowDto } from '@/interfaces/IFollowRequest';
import { BasicResponse } from '@/common/basic_response.common';
import { FollowResponse } from '@/common/follow_response.common';

@Controller('api/follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('/me')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getFollows(@Req() req): Promise<BasicResponse> {
    const user_data = req.user as IJWT;
    const follows = await this.followService.getFollowing(user_data.user_id);

    return new FollowResponse('Get followers successfully', false, follows);
  }

  @Get('/isFollow/:friend_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async isFollow(
    @Req() req,
    @Param('friend_id') param: string,
  ): Promise<boolean> {
    const user_data = req.user as IJWT;
    const isFollow = await this.followService.isFollow(
      user_data.user_id,
      param,
    );

    return isFollow;
  }

  @Post()
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async followOrUnfollow(
    @Req() req,
    @Body() followDto: BodyFollowDto,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;

    if (user_data.user_id === followDto.follow_id) {
      return new BasicResponse('You can not follow yourself', true);
    }

    const message = await this.followService.followOrUnfollow(
      user_data.user_id,
      followDto.follow_id,
    );

    if (!message) {
      return new BasicResponse('Follow or unfollow failed', true);
    }

    return new BasicResponse(`${message} successfully`, false);
  }
}
