import { Injectable } from '@nestjs/common';
import { Users } from '@/entities/users.entity';
import { Albums } from '@/entities/albums.entity';
import { UserService } from '@/repositories/users/user.service';

@Injectable()
export class AlbumService {
  constructor(private usersService: UserService) {}

  private createAlbum(album_name: string, user: Users): Albums {
    const album = new Albums();
    album.album_name = album_name;
    album.user = user;

    return album;
  }

  async saveAlbum(album_name: string, user_id: string): Promise<Albums | null> {
    const user = await this.usersService.getUserById(user_id);
    if (!user) {
      return null;
    }

    const album = this.createAlbum(album_name, user);

    try {
      const res = await album.save();
      if (!res) {
        return null;
      }
      return album;
    } catch (err) {
      return null;
    }
  }

  async getAlbumById(
    album_id: string,
    user_id: string,
  ): Promise<Albums | null> {
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

  async updateAlbum(
    album_name: string,
    user_id: string,
    album_id: string,
  ): Promise<Albums | null> {
    const album = await this.getAlbumById(album_id, user_id);
    album.album_name = album_name;

    try {
      await album.save();
      return album;
    } catch (err) {
      return null;
    }
  }

  async deleteAlbum(user_id: string, album_id: string): Promise<Albums | null> {
    const album = await this.getAlbumById(album_id, user_id);

    try {
      const res = await album.remove();

      if (!res) {
        return null;
      }

      return album;
    } catch (err) {
      return null;
    }
  }
}
