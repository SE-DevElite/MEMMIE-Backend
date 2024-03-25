import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { FriendlistService } from './friendlist.service';
import { AuthenGuard } from '@/repositories/auth/auth.guard';
import { BasicResponse } from '@/common/basic_response.common';
import {
  BodyFriendlistDto,
  ParamsFriendlistDto,
} from '@/interfaces/IFriendlistRequest';
import { IJWT } from '@/interfaces/IAuthRequest';
import { FriendListResponse } from '@/common/friend_list_response.common';
import {
  AllFriendResponse,
  ManyUserResponse,
} from '@/common/user_response.common';

@Controller('api/friendlists')
export class FriendlistController {
  constructor(private readonly friendlistService: FriendlistService) {}

  @Post('/create')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createFriendlist(
    @Req() req,
    @Body() friendlistDto: BodyFriendlistDto,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;

    const res = await this.friendlistService.saveFriendlist(
      user_data.user_id,
      friendlistDto.friendlist_name,
      friendlistDto.friendlist_id,
    );

    if (res) {
      return new FriendListResponse('Create friendlist success', false, res);
    }

    return new FriendListResponse('Create friendlist fail', true, null);
  }

  @Get('/friend')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getFriendlist(@Req() req): Promise<BasicResponse> {
    const user_data = req.user as IJWT;

    const res = await this.friendlistService.getAllFriends(user_data.user_id);

    if (res!) {
      return new BasicResponse('Get friendlist fail', true);
    }

    return new AllFriendResponse('Get friendlist success', false, res);
  }

  // @Patch('/update/:friendlist_id')
  // @UseGuards(AuthenGuard)
  // @HttpCode(HttpStatus.OK)
  // async updateFriendlist(
  //   @Req() req,
  //   @Body() friendlistDto: BodyFriendlistDto,
  //   @Param() params: ParamsFriendlistDto,
  // ): Promise<BasicResponse> {
  //   const user_data = req.user as IJWT;
  //   const res = await this.friendlistService.updateFriendlist(
  //     user_data.user_id,
  //     friendlistDto.friendlist_name,
  //     params.friendlist_id,
  //   );
  //   if (res) {
  //     return new BasicResponse('Update friendlist success', false);
  //   }
  //   return new BasicResponse('Update friendlist fail', true);
  // }

  // @Delete('/delete/:friendlist_id')
  // @UseGuards(AuthenGuard)
  // @HttpCode(HttpStatus.OK)
  // async deleteFriendlist(
  //   @Req() req,
  //   @Param() params: ParamsFriendlistDto,
  // ): Promise<BasicResponse> {
  //   const user_data = req.user as IJWT;

  //   const res = await this.friendlistService.deleteFriendlist(
  //     user_data.user_id,
  //     params.friendlist_id,
  //   );

  //   if (res) {
  //     return new BasicResponse('Delete friendlist success', false);
  //   }

  //   return new BasicResponse('Delete friendlist fail', true);
  // }
}
