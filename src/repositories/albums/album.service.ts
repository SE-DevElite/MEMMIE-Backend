import { Injectable } from '@nestjs/common';
import { Users } from '@/entities/users.entity';
import { Albums } from '@/entities/albums.entity';
import { UserService } from '@/repositories/users/user.service';
import { Memories } from '@/entities/memory_card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from '@/entities/tags.entity';

@Injectable()
export class AlbumService {
  constructor(
    private usersService: UserService,
    @InjectRepository(Albums)
    private albumRepository: Repository<Albums>,
  ) {}

  private createAlbum(album_name: string, user: Users): Albums {
    const album = new Albums();
    album.album_name = album_name;
    album.user = user;

    return album;
  }

  async findManyMemoryById(memories_id: string[]): Promise<Memories[]> {
    const memories = await Memories.createQueryBuilder('memories')
      .where('memories.memory_id IN (:...memories_id)', { memories_id })
      .getMany();
    return memories;
  }

  async findManyTagById(tag_id: string[]): Promise<Tags[]> {
    const tags = await Tags.createQueryBuilder('tags')
      .where('tags.tag_id IN (:...tag_id)', { tag_id })
      .getMany();
    return tags;
  }

  async saveAlbum(
    user_id: string,
    album_name: string,
    tag_id: string[],
    memories_id: string[],
  ): Promise<Albums | null> {
    const user = await this.usersService.getUserById(user_id);
    if (!user) {
      return null;
    }

    const album = this.createAlbum(album_name, user);

    if (memories_id.length > 0) {
      const memories = await this.findManyMemoryById(memories_id);

      // console.log(memories);

      if (memories.length == 0) {
        return null;
      }

      album.memories = memories;
    }

    if (tag_id.length > 0) {
      const tags = await this.findManyTagById(tag_id);
      album.tags = tags;
    }

    try {
      const savedAlbum = await this.albumRepository.save(album);
      delete savedAlbum.user;

      return savedAlbum;
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
