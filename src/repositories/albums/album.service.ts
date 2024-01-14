import { Albums } from '@/entities/albums.entity';
import { Users } from '@/entities/users.entity';
import { Memories } from '@/entities/memory_card.entity';
import { Injectable } from '@nestjs/common';
import { UserService } from '@/repositories/users/user.service';

@Injectable()
export class AlbumService {
  constructor(private usersService: UserService) {}

  private createAlbum(album_name: string, user_id: Users) {
    const album = new Albums();
    album.album_name = album_name;
    album.user_id = user_id;
    return album;
  }

  async saveAlbum(album_name: string, user_id: string) {
    const user = await this.usersService.getUserById(user_id);
    if (!user) {
      return null;
    }

    const album = this.createAlbum(album_name, user);
    const res = await album.save();

    return res;
  }

  async getAlbumById(album_id: string, user_id: string) {
    try {
      const res = await Albums.createQueryBuilder('albums')
        .where('albums.user_id = :user_id', { user_id })
        .andWhere('albums.album_id = :album_id', { album_id })
        .getOne();
      return res;
    } catch (err) {
      return null;
    }
  }

  async updateAlbum(album_name: string, user_id: string, album_id: string) {
    const album = await this.getAlbumById(album_id, user_id);
    album.album_name = album_name;
    try {
      await album.save();
      return album;
    } catch (err) {
      return null;
    }
  }

  async deleteAlbum(user_id: string, album_id: string) {
    const album = await this.getAlbumById(album_id, user_id);
    try {
      await album.remove();
      return album;
    } catch (err) {
      return null;
    }
  }
}
