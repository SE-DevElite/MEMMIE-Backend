import { Injectable } from '@nestjs/common';
import { Users } from '@/entities/users.entity';
import { UserService } from '../users/user.service';
import {
  DayEnum,
  Memories,
  MoodEnum,
  WeatherEnum,
} from '@/entities/memory_card.entity';
import { FriendLists } from '@/entities/friend_list.entity';
import { FriendlistService } from '../friendlists/friendlist.service';
import { AWSService } from '../aws/aws.service';
import * as crypto from 'crypto';
import { Mentions } from '@/entities/mention.entity';
import { MentionsService } from '../mentions/mentions.service';

@Injectable()
export class MemoryService {
  constructor(
    private usersService: UserService,
    private friendListService: FriendlistService,
    private awsService: AWSService,
    private mentionService: MentionsService,
  ) {}

  private createMemoryObject(
    user: Users,
    mood: MoodEnum,
    weather: WeatherEnum,
    day: DayEnum,
    selected_datetime: string,
    caption: string,
    short_caption: string,
    friend_list: FriendLists,
    location_name?: string,
  ) {
    const memory = new Memories();
    memory.user = user;
    memory.caption = caption;
    memory.short_caption = short_caption;
    memory.friend_list = friend_list;
    memory.mood = mood;
    memory.weather = weather;
    memory.day = day;
    memory.selected_datetime = selected_datetime;
    memory.location_name = location_name;

    return memory;
  }

  async getMemoryById(memory_id: string): Promise<Memories> {
    const res = await Memories.findOne({
      where: { memory_id },
      relations: ['user'],
    });
    return res;
  }

  async getMemoryByYearAndMonth(user_id: string, year: string, month: string) {
    const res = await Memories.createQueryBuilder('memory')
      .where('memory.user_id = :user_id', { user_id })
      .andWhere('EXTRACT(YEAR FROM memory.created_at) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM memory.created_at) = :month', { month })
      .getMany();
    return res;
  }

  async createMemory(
    user_id: string,
    mood: MoodEnum,
    weather: WeatherEnum,
    day: DayEnum,
    selected_datetime: string,
    caption: string,
    short_caption: string,
    mentions: string[],
    friend_list_id: string,
    location_name?: string,
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

    const memory = this.createMemoryObject(
      user,
      mood,
      weather,
      day,
      selected_datetime,
      caption,
      short_caption,
      friendList,
      location_name,
    );

    const res = await memory.save();

    try {
      if (mentions && mentions.length != 0) {
        await Mentions.save(
          mentions.map((mention) => {
            const m = new Mentions();
            m.friend_id = mention;
            m.memory_id = res.memory_id;

            return m;
          }),
        );
      }
    } catch (err) {
      res.remove();
      return null;
    }

    delete res.user;

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
    mood: MoodEnum,
    weather: WeatherEnum,
    day: DayEnum,
    selected_datetime: string,
    caption: string,
    short_caption: string,
    mentions: string[],
    friend_list_id: string,
    location_name?: string,
  ): Promise<Memories | null> {
    const existingMemory = await this.getMemoryById(memory_id);
    if (!existingMemory || existingMemory.user.user_id !== user_id) {
      return null;
    }

    const friend_list = await this.friendListService.getFriendlistByID(
      user_id,
      friend_list_id,
    );

    const mention = await this.mentionService.getAllMemoryMentions(memory_id);

    // Remove mention that not in new mention list
    for (const m of mention) {
      if (!mentions.includes(m.friend_id)) {
        await m.remove();
      }
    }

    // Add new mention
    for (const m of mentions) {
      if (!mention.map((x) => x.friend_id).includes(m)) {
        const newMention = new Mentions();
        newMention.friend_id = m;
        newMention.memory_id = memory_id;

        await newMention.save();
      }
    }

    existingMemory.caption = caption;
    existingMemory.short_caption = short_caption;
    existingMemory.friend_list = friend_list;
    existingMemory.mood = mood;
    existingMemory.weather = weather;
    existingMemory.day = day;
    existingMemory.selected_datetime = selected_datetime;
    existingMemory.location_name = location_name;

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
