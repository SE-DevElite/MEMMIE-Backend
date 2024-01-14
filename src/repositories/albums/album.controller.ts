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
import { AuthenGuard } from '../auth/auth.guard';
import { IJWT } from '@/interfaces/IAuthRequest';
import {
  AlbumDto,
  DeleteAlbumDto,
  UpdateAlbumDto,
} from '@/interfaces/IAlbumRequest';

@Controller('api/albums')
export class AlbumController {
  constructor(private readonly AlbumService: AlbumService) {}

  @Post('/create')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAlbums(@Req() req, @Body() albumDto: AlbumDto) {
    const user_data = req.user as IJWT;
    const res = await this.AlbumService.saveAlbum(
      albumDto.album_name,
      user_data.user_id,
    );
    return res;
  }

  @Patch('/update')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async updateAlbums(@Req() req, @Body() albumDto: UpdateAlbumDto) {
    const user_data = req.user as IJWT;
    const res = await this.AlbumService.updateAlbum(
      albumDto.album_name,
      user_data.user_id,
      albumDto.album_id,
    );
    return res;
  }

  @Delete('/delete/:album_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAlbums(@Req() req, @Param() params: DeleteAlbumDto) {
    const user_data = req.user as IJWT;
    const res = await this.AlbumService.deleteAlbum(
      user_data.user_id,
      params.album_id,
    );
    return res;
  }
}
