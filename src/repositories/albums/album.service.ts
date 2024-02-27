import { Injectable } from '@nestjs/common';
import { Users } from '@/entities/users.entity';
import { Albums } from '@/entities/albums.entity';
import { UserService } from '@/repositories/users/user.service';
import { Memories } from '@/entities/memory_card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AWSService } from '../aws/aws.service';

@Injectable()
export class AlbumService {
  constructor(
    private usersService: UserService,
    @InjectRepository(Albums)
    private albumRepository: Repository<Albums>,

    private awsService: AWSService,
  ) {}

  private createAlbum(
    album_name: string,
    user: Users,
    tag_name: string,
  ): Albums {
    const album = new Albums();
    album.album_name = album_name;
    album.user = user;
    album.tag_name = tag_name;

    return album;
  }

  async findManyMemoryById(memories_id: string[]): Promise<Memories[]> {
    const memories = await Memories.createQueryBuilder('memories')
      .where('memories.memory_id IN (:...memories_id)', { memories_id })
      .getMany();
    return memories;
  }

  async saveAlbum(
    user_id: string,
    album_name: string,
    tag_name: string[],
    memories_id: string[],
  ): Promise<Albums | null> {
    const user = await this.usersService.getUserById(user_id);
    if (!user) {
      return null;
    }
    const tags = tag_name.join(',');
    const album = this.createAlbum(album_name, user, tags);

    if (memories_id.length > 0) {
      const memories = await this.findManyMemoryById(memories_id);

      if (memories.length == 0) {
        return null;
      }

      album.memories = memories;
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
    user_id: string,
    album_id: string,
  ): Promise<Albums | null> {
    try {
      const res = await Albums.createQueryBuilder('albums')
        .where('albums.user_id = :user_id', { user_id })
        .andWhere('albums.album_id = :album_id', { album_id })
        .leftJoinAndSelect('albums.memories', 'memories')
        .leftJoinAndSelect('memories.memory_lists', 'memory_lists')
        .getOne();

      for (const memory of res.memories) {
        const tumbnail = memory.memory_lists[0].memory_url;
        const url = await this.awsService.s3_getObject(
          process.env.BUCKET_NAME,
          tumbnail,
        );

        memory.memory_lists = url as any;
      }

      if (!res) {
        return null;
      }

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
