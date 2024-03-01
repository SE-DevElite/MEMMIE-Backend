import {
  Body,
  Controller,
  Delete,
  Get,
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
import { AlbumResponse } from '@/common/album_response.common';

@Controller('api/albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get('/:album_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getAlbums(
    @Req() req,
    @Param() params: ParamsAlbumDto,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;
    const res = await this.albumService.getAlbumById(
      user_data.user_id,
      params.album_id,
    );

    if (res) {
      if (res.tag_name != null) {
        res.tag_name = res.tag_name.split(',') as any;
      }

      console.log(res);

      return new AlbumResponse('Get album success', false, res);
    }

    return new AlbumResponse('Get album fail', true, null);
  }

  @Post('/create')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAlbums(
    @Req() req,
    @Body() albumDto: BodyAlbumDto,
  ): Promise<BasicResponse> {
    const user_data = req.user as IJWT;
    if (!albumDto.memories)
      return new AlbumResponse('No memory provide', true, null);

    const res = await this.albumService.saveAlbum(
      user_data.user_id,
      albumDto.album_name,
      albumDto.tags,
      albumDto.memories,
    );

    if (!res) {
      return new AlbumResponse('Create album fail', true, null);
    }

    return new AlbumResponse('Create album success', false, res);
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
