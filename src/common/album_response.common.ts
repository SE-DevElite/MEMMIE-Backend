import { Albums } from '@/entities/albums.entity';
import { BasicResponse } from './basic_response.common';

export class AlbumResponse extends BasicResponse {
  constructor(message: string, error: boolean, album: Albums) {
    super(message, error);

    if (!album) {
      this.album = null;
      return;
    }
    delete album.user;
    this.album = album;
  }

  private album: Albums;
}
