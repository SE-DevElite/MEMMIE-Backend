import { Injectable } from '@nestjs/common';
import { Users } from '@/entities/users.entity';
import { UserService } from '../users/user.service';
import { Memories } from '@/entities/memory_card.entity';
import { FriendLists } from '@/entities/friend_list.entity';
import { FriendlistService } from '../friendlists/friendlist.service';
import { AWSService } from '../aws/aws.service';
import * as crypto from 'crypto';

@Injectable()
export class MemoryService {
  constructor(
    private usersService: UserService,
    private friendListService: FriendlistService,
    private awsService: AWSService,
  ) {}

  private async createMemory(
    user: Users,
    caption: string,
    short_caption: string,
    friend_list: FriendLists,
  ) {
    const memory = new Memories();
    memory.user = user;
    memory.caption = caption;
    memory.short_caption = short_caption;
    memory.friend_list = friend_list;

    return memory;
  }

  async getMemoryById(memory_id: string): Promise<Memories> {
    const res = await Memories.findOne({
      where: { memory_id },
      relations: ['user'],
    });
    return res;
  }

  async getMemoryByYearAndMonth(year: string, month: string) {
    const res = await Memories.createQueryBuilder('memory')
      .where('EXTRACT(YEAR FROM memory.created_at) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM memory.created_at) = :month', { month })
      .getMany();
    return res;
  }

  async createMemoryById(
    user_id: string,
    caption: string,
    short_caption: string,
    friend_list_id: string,
  ): Promise<Memories> {
    const user = await this.usersService.getUserById(user_id);
    if (!user) {
      return null;
    }

    const friendList = await this.friendListService.getFriendlistByID(
      user.user_id,
      friend_list_id,
    );
    if (!friendList) {
      return null;
    }

    const memory = await this.createMemory(
      user,
      caption,
      short_caption,
      friendList,
    );

    const res = await memory.save();
    return res;
  }

  async uploadMemoryImage(
    user_id: string,
    memory_id: string,
    memory_image: Express.Multer.File,
  ) {
    const memory = await this.getMemoryById(memory_id);
    if (!memory) {
      return null;
    }
    if (memory.user.user_id !== user_id) {
      return null;
    }

    const encryptFileName = crypto.randomBytes(32).toString('hex');
    const uploadResponse = await this.awsService.s3_upload(
      memory_image.buffer,
      process.env.BUCKET_NAME,
      encryptFileName,
      memory_image.mimetype,
    );
    if (!uploadResponse) {
      return null;
    }

    memory.memory_image = encryptFileName;

    const res = await memory.save();
    if (!res) {
      return null;
    }

    return res;
  }

  async updateMemoryById(
    memory_id: string,
    user_id: string,
    caption: string,
    short_caption: string,
    friend_list_id: string,
  ): Promise<Memories | null> {
    const existingMemory = await this.getMemoryById(memory_id);
    if (!existingMemory || existingMemory.user.user_id !== user_id) {
      return null;
    }

    const friend_list = await this.friendListService.getFriendlistByID(
      user_id,
      friend_list_id,
    );

    existingMemory.caption = caption;
    existingMemory.short_caption = short_caption;
    existingMemory.friend_list = friend_list;

    const updatedMemory = await existingMemory.save();

    return updatedMemory;
  }

  async deleteMemoryById(memory_id: string, user_id: string): Promise<boolean> {
    const existingMemory = await this.getMemoryById(memory_id);
    if (!existingMemory || existingMemory.user.user_id !== user_id) {
      return false;
    }

    this.awsService.s3_deleteObject(
      process.env.BUCKET_NAME,
      existingMemory.memory_image,
    );

    const res = await existingMemory.remove();
    if (!res) {
      return false;
    }

    return true;
  }
}
