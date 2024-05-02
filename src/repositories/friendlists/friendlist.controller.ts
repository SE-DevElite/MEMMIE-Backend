import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Get,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { FriendlistService } from './friendlist.service';
import { AuthenGuard } from '@/repositories/auth/auth.guard';
import { BasicResponse } from '@/common/basic_response.common';
import { BodyFriendlistDto } from '@/interfaces/IFriendlistRequest';
import { IJWT } from '@/interfaces/IAuthRequest';
import {
  AllFriendListResponse,
  FriendListResponse,
} from '@/common/friend_list_response.common';
import { AllFriendResponse } from '@/common/user_response.common';

@Controller('api/friendlists')
export class FriendlistController {
  constructor(private readonly friendlistService: FriendlistService) {}

  @Get('/mention/:id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getMention(@Param('id') memory_id: string): Promise<BasicResponse> {
    const res = await this.friendlistService.getTagInMemory(memory_id);

    if (!res) {
      return new AllFriendResponse('Get mention fail', true, null);
    }

    return new AllFriendResponse('Get mention success', false, res);
  }

  @Get('/all')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getFriendlist(@Req() req): Promise<BasicResponse> {
    const user_data = req.user as IJWT;

    const res = await this.friendlistService.getAllFriendlist(
      user_data.user_id,
    );

    if (!res) {
      return new BasicResponse('Get friendlist fail', true);
    }

    for (const friendlist of res) {
      const count = await this.friendlistService.countFriendlist(
        user_data.user_id,
        friendlist.friend_list_id,
      );

      friendlist['total'] = count;
    }

    return new AllFriendListResponse('Get friendlist success', false, res);
  }

  @Get('/friend-in-list')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getFriendInList(
    @Req() req,
    @Query('id') friendList_id: string,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;

    const res = await this.friendlistService.getFriendInList(
      user_data.user_id,
      friendList_id,
    );

    if (!res) {
      return new BasicResponse('Get friendlist fail', true);
    }

    return new AllFriendResponse('Get friendlist success', false, res);
  }

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

    if (!res) {
      return new FriendListResponse('Create friendlist fail', true, null);
    }

    return new FriendListResponse('Create friendlist success', false, res);
  }

  @Get('/friend')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getFriend(@Req() req): Promise<BasicResponse> {
    const user_data = req.user as IJWT;

    const res = await this.friendlistService.getAllFriends(user_data.user_id);

    if (!res) {
      return new BasicResponse('Get friendlist fail', true);
    }

    return new AllFriendResponse('Get friendlist success', false, res);
  }

  @Patch('/update/:friendlist_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async updateFriendlist(
    @Req() req,
    @Body() friendlistDto: BodyFriendlistDto,
    @Param('friendlist_id') friendlist_id: string,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;

    const res = await this.friendlistService.updateFriendList(
      user_data.user_id,
      friendlist_id,
      friendlistDto.friendlist_name,
      friendlistDto.friendlist_id,
    );
    if (res) {
      return new BasicResponse('Update friendlist success', false);
    }
    return new BasicResponse('Update friendlist fail', true);
  }

  @Delete('/delete/:friendlist_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async deleteFriendlist(
    @Req() req,
    @Param('friendlist_id') friendlist_id: string,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;

    const res = await this.friendlistService.deleteFriendList(
      user_data.user_id,
      friendlist_id,
    );

    if (res) {
      return new BasicResponse('Delete friendlist success', false);
    }

    return new BasicResponse('Delete friendlist fail', true);
  }
}
