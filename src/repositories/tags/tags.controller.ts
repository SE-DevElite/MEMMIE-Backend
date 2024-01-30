import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { AuthenGuard } from '../auth/auth.guard';
import { IJWT } from '@/interfaces/IAuthRequest';
import { TagBodyDto, TagParamsDto } from '@/interfaces/ITagRequest';
import { BasicResponse } from '@/common/basic_response.common';
import { TagResponse } from '@/common/tag_response.common';

@Controller('api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async findAllTag(@Req() req) {
    const user_data = req.user as IJWT;

    const res = await this.tagsService.findAllTagByUserId(user_data.user_id);

    return new TagResponse('get all tag success', false, res);
  }

  @Post('/create')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createTag(@Req() req, @Body() createTagBody: TagBodyDto) {
    const user_data = req.user as IJWT;

    const res = await this.tagsService.createTag(
      user_data.user_id,
      createTagBody.tag_name,
    );

    delete res.user;

    if (!res) {
      return new BasicResponse('can not create tag', true);
    }

    return new TagResponse('create tag success', false, [res]);
  }

  @Delete('/delete/:tag_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async deleteTag(@Req() req, @Param() params: TagParamsDto) {
    const user_data = req.user as IJWT;

    const res = await this.tagsService.deleteTag(
      user_data.user_id,
      params.tag_id,
    );

    if (!res) {
      return new BasicResponse('can not delete tag', true);
    }

    return new TagResponse('delete tag success', false, [res]);
  }
}
