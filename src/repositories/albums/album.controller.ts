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
import { AlbumService } from './album.service';
import { IJWT } from '@/interfaces/IAuthRequest';
import { AuthenGuard } from '@/repositories/auth/auth.guard';
import { BasicResponse } from '@/common/basic_response.common';
import { BodyAlbumDto, ParamsAlbumDto } from '@/interfaces/IAlbumRequest';

@Controller('api/albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post('/create')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAlbums(
    @Req() req,
    @Body() albumDto: BodyAlbumDto,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;
    const res = await this.albumService.saveAlbum(
      albumDto.album_name,
      user_data.user_id,
    );

    if (res) {
      return new BasicResponse('Create album success', false);
    }

    return new BasicResponse('Create album fail', true);
  }

  @Patch('/update/:album_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async updateAlbums(
    @Req() req,
    @Body() albumDto: BodyAlbumDto,
    @Param() params: ParamsAlbumDto,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;
    const res = await this.albumService.updateAlbum(
      albumDto.album_name,
      user_data.user_id,
      params.album_id,
    );
    if (res) {
      return new BasicResponse('Update album success', false);
    }

    return new BasicResponse('Update album fail', true);
  }

  @Delete('/delete/:album_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAlbums(
    @Req() req,
    @Param() params: ParamsAlbumDto,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;
    const res = await this.albumService.deleteAlbum(
      user_data.user_id,
      params.album_id,
    );

    if (res) {
      return new BasicResponse('Delete album success', false);
    }

    return new BasicResponse('Delete album fail', true);
  }
}
