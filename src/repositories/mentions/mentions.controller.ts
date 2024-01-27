import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MentionsService } from './mentions.service';
import { AuthenGuard } from '../auth/auth.guard';
import { MentionBodyDto } from '@/interfaces/IMentionRequest';
import { IJWT } from '@/interfaces/IAuthRequest';
import { BasicResponse } from '@/common/basic_response.common';
import { MentionResponse } from '@/common/mention_response.common';

@Controller('api/mentions')
export class MentionsController {
  constructor(private readonly mentionService: MentionsService) {}

  @Get('/friend')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenGuard)
  async getFriendCanMention(@Req() req) {
    const user_data = req.user as IJWT;
    const friends = await this.mentionService.getFriendCanMention(
      user_data.user_id,
    );

    return new MentionResponse(
      'Get friend can mention successfully',
      false,
      friends,
    );
  }

  @Patch('/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenGuard)
  async updateMention(@Req() req, @Body() body: MentionBodyDto) {
    const user_data = req.user as IJWT;
    const { memory_id, friend_id } = body;

    const msg = await this.mentionService.updateMention(
      user_data.user_id,
      memory_id,
      friend_id,
    );

    if (msg === true) {
      return new BasicResponse('Update mention successfully', false);
    }

    return new BasicResponse(msg, false);
  }
}
