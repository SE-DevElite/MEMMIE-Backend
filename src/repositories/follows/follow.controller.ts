import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthenGuard } from '../auth/auth.guard';
import { IJWT } from '@/interfaces/IAuthRequest';
import { FollowDto } from '@/interfaces/IFollowRequest';
import { BasicResponse } from '@/common/basic_response.common';

@Controller('api/follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async followOrUnfollow(@Req() req, @Body() followDto: FollowDto) {
    const user_data = req.user as IJWT;

    if (user_data.user_id === followDto.follow_id) {
      return new BasicResponse('You can not follow yourself', true);
    }

    const res = await this.followService.followOrUnfollow(
      user_data.user_id,
      followDto.follow_id,
    );

    if (!res) {
      return new BasicResponse('Follow or unfollow failed', true);
    }

    return new BasicResponse('Follow or unfollow successfully', false);
  }
}
