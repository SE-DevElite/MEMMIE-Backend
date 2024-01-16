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
} from '@nestjs/common';
import { FriendlistService } from './friendlist.service';
import { AuthenGuard } from '@/repositories/auth/auth.guard';
import { BasicResponse } from '@/common/basic_response.common';
import {
  BodyFriendlistDto,
  ParamsFriendlistDto,
} from '@/interfaces/IFriendlistRequest';

@Controller('api/friendlist')
export class FriendlistController {
  constructor(private readonly friendlistService: FriendlistService) {}

  @Post('/create')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createFriendlist(@Body() friendlistDto: BodyFriendlistDto) {
    const res = await this.friendlistService.saveFriendlist(
      friendlistDto.friendlist_name,
    );
    if (res) {
      return new BasicResponse('Create friendlist success', false);
    }
    return new BasicResponse('Create friendlist fail', true);
  }

  @Patch('/update/:friend_list_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async updateFriendlist(
    @Body() friendlistDto: BodyFriendlistDto,
    @Param() params: ParamsFriendlistDto,
  ) {
    const res = await this.friendlistService.updateFriendlist(
      friendlistDto.friendlist_name,
      params.friendlist_id,
    );
    if (res) {
      return new BasicResponse('Update friendlist success', false);
    }
    return new BasicResponse('Update friendlist fail', true);
  }

  @Delete('/delete/:friend_list_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async deleteFriendlist(@Param() params: ParamsFriendlistDto) {
    const res = await this.friendlistService.deleteFriendlist(
      params.friendlist_id,
    );

    if (res) {
      return new BasicResponse('Delete friendlist success', false);
    }

    return new BasicResponse('Delete friendlist fail', true);
  }
}
