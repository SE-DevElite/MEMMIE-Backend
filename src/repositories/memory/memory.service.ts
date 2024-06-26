import { Injectable } from '@nestjs/common';
import { Users } from '@/entities/users.entity';
import { UserService } from '../users/user.service';
import { Repository } from 'typeorm';
import {
  DayEnum,
  Memories,
  MoodEnum,
  PrivacyEnum,
  WeatherEnum,
} from '@/entities/memory_card.entity';
import { FriendLists } from '@/entities/friend_list.entity';
import { FriendlistService } from '../friendlists/friendlist.service';
import { AWSService } from '../aws/aws.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryList } from '@/entities/memory_list.entity';
import { Follows } from '@/entities/follows.entity';

@Injectable()
export class MemoryService {
  constructor(
    private usersService: UserService,
    private friendListService: FriendlistService,
    private awsService: AWSService,
    @InjectRepository(Memories)
    private memoryRepository: Repository<Memories>,

    @InjectRepository(MemoryList)
    private memoryListRepository: Repository<MemoryList>,

    @InjectRepository(Follows)
    private followRepository: Repository<Follows>,
  ) {}

  private createMemoryObject(
    user: Users,
    mood: MoodEnum,
    weather: WeatherEnum,
    day: DayEnum,
    selected_datetime: string,
    caption: string,
    short_caption: string,
    friend_list: FriendLists | null,
    location_name?: string,
    lat?: string,
    long?: string,
    privacy?: PrivacyEnum,
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
    memory.lat = lat;
    memory.long = long;
    memory.privacy = privacy;

    return memory;
  }

  async getMemoryById(memory_id: string): Promise<Memories> {
    const res = await Memories.findOne({
      where: { memory_id },
      relations: ['user'],
    });
    return res;
  }

  async getFriendMemoryId(user_id: string, my_id: string): Promise<Memories[]> {
    const res = await this.memoryRepository
      .createQueryBuilder('memory')
      .where('memory.user_id = :user_id', { user_id })
      .leftJoinAndSelect('memory.memory_lists', 'memory_lists')
      .leftJoin('memory.friend_list', 'friend_list')
      .leftJoin('friend_list.friend_id', 'users')
      .andWhere('memory.privacy = :privacy', {
        privacy: PrivacyEnum.PUBLIC,
      })
      .orWhere('users.user_id = :my_id', { my_id })
      .getMany();

    for (const memory of res) {
      for (const list of memory.memory_lists) {
        list.memory_url = await this.awsService.s3_getObject(
          process.env.BUCKET_NAME,
          list.memory_url,
        );
      }
    }

    return res;
  }

  async getMemoryByUserId(user_id: string): Promise<Memories[]> {
    const res = await Memories.createQueryBuilder('memory')
      .where('memory.user_id = :user_id', { user_id })
      .leftJoinAndSelect('memory.memory_lists', 'memory_lists')
      .leftJoinAndSelect('memory.friend_list', 'friend_list')
      .orderBy('memory_lists.created_at', 'DESC')
      .getMany();

    for (const memory of res) {
      for (const list of memory.memory_lists) {
        list.memory_url = await this.awsService.s3_getObject(
          process.env.BUCKET_NAME,
          list.memory_url,
        );
      }
    }

    return res;
  }

  async getMemoryByYearAndMonth(user_id: string, year: string, month: string) {
    //format date 2024-01-27 23:03

    const res = await Memories.createQueryBuilder('memory')
      .where('memory.user_id = :user_id', { user_id })
      .andWhere('memory.selected_datetime like :date', {
        date: `${year}-${month}%`,
      })
      .leftJoinAndSelect('memory.memory_lists', 'memory_lists')
      .leftJoinAndSelect('memory.friend_list', 'friend_list')
      .orderBy('memory_lists.created_at', 'DESC')
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
    lat?: string,
    long?: string,
    privacy?: PrivacyEnum,
  ): Promise<Memories> {
    const user = await this.usersService.getUserById(user_id);
    if (!user) {
      return null;
    }

    const friendList = await this.friendListService.getFriendlistByID(
      user.user_id,
      friend_list_id,
    );

    const memory = this.createMemoryObject(
      user,
      mood,
      weather,
      day,
      selected_datetime,
      caption,
      short_caption,
      friendList || null,
      location_name,
      lat,
      long,
      privacy,
    );

    if (mentions.length > 0) {
      const mention_friend = await this.usersService.findManyUsersByIds(
        mentions,
      );
      memory.mentions = mention_friend;
    }

    const res = await this.memoryRepository.save(memory);
    delete res.user;

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
    lat?: string,
    long?: string,
    privacy?: PrivacyEnum,
  ): Promise<Memories | null> {
    const existingMemory = await this.getMemoryById(memory_id);
    if (!existingMemory || existingMemory.user.user_id !== user_id) {
      return null;
    }

    const friend_list = await this.friendListService.getFriendlistByID(
      user_id,
      friend_list_id,
    );
    // if (!friend_list) {
    //   return null;
    // }

    if (mentions.length > 0) {
      const mention_friend = await this.usersService.findManyUsersByIds(
        mentions,
      );
      existingMemory.mentions = mention_friend;
    } else {
      existingMemory.mentions = [];
    }

    existingMemory.caption = caption;
    existingMemory.short_caption = short_caption;
    existingMemory.friend_list = friend_list;
    existingMemory.mood = mood;
    existingMemory.weather = weather;
    existingMemory.day = day;
    existingMemory.selected_datetime = selected_datetime;
    existingMemory.location_name = location_name;
    existingMemory.lat = lat;
    existingMemory.long = long;
    existingMemory.privacy = privacy;

    const updatedMemory = await existingMemory.save();
    return updatedMemory;
  }

  async deleteMemoryById(memory_id: string, user_id: string): Promise<boolean> {
    const existingMemory = await this.getMemoryById(memory_id);
    if (!existingMemory || existingMemory.user.user_id !== user_id) {
      return false;
    }

    const res = await existingMemory.remove();
    if (!res) {
      return false;
    }

    if (!res.memory_lists) {
      return true;
    }

    for (const memory_list of res.memory_lists) {
      await this.awsService.s3_deleteObject(
        process.env.BUCKET_NAME,
        memory_list.memory_url,
      );
    }

    return true;
  }

  async filterMemories(
    user_id: string,
    mood?: string,
    weather?: string,
    date1?: Date,
    date2?: Date,
  ): Promise<Memories[]> {
    const query = this.memoryRepository
      .createQueryBuilder('memory')
      .where('memory.user_id = :user_id', { user_id })
      .leftJoinAndSelect('memory.memory_lists', 'memory_lists')
      .orderBy('memory_lists.created_at', 'DESC');

    if (mood) {
      query.andWhere('memory.mood = :mood', { mood });
    }

    if (weather) {
      query.andWhere('memory.weather = :weather', { weather });
    }

    if (date1 && date2) {
      query.andWhere('memory.selected_datetime BETWEEN :date1 AND :date2', {
        date1,
        date2,
      });
    }

    const res = await query.getMany();

    for (const memory of res) {
      for (const list of memory.memory_lists.slice(0, 1)) {
        list.memory_url = await this.awsService.s3_getObject(
          process.env.BUCKET_NAME,
          list.memory_url,
        );
      }
    }

    return res;
  }

  async deleteAllMemoryImageById(memory_id: string) {
    const existImage = await this.memoryRepository.findOne({
      where: { memory_id },
      relations: ['memory_lists'],
    });

    if (!existImage) {
      return null;
    }

    for (const memory_list of existImage.memory_lists) {
      await this.awsService.s3_deleteObject(
        process.env.BUCKET_NAME,
        memory_list.memory_url,
      );
    }

    const existingMemoryList = await this.memoryListRepository
      .createQueryBuilder('memory_list')
      .where('memory_list.memory_id = :memory_id', { memory_id })
      .getMany();

    if (existingMemoryList.length > 0) {
      await this.memoryListRepository.remove(existingMemoryList);
    }

    return true;
  }

  async getUserFeed(user_id: string): Promise<Memories[]> {
    try {
      const friends = await this.friendListService.getAllFriends(user_id);
      const friendIds = friends.map((friend) => friend.user_id);

      friendIds.push(user_id);

      const feed = await this.memoryRepository
        .createQueryBuilder('memory')
        .leftJoinAndSelect('memory.memory_lists', 'memory_lists')
        .leftJoin('memory.user', 'user')
        .leftJoin('memory.friend_list', 'friend_list')
        .leftJoin('friend_list.friend_id', 'users')
        .where('memory.user_id IN (:...friendIds)', { friendIds })
        .orWhere('memory.privacy = :privacy', { privacy: PrivacyEnum.PUBLIC })
        .orderBy('memory.created_at', 'DESC')
        .getMany();

      for (const memory of feed) {
        for (const list of memory.memory_lists) {
          list.memory_url = await this.awsService.s3_getObject(
            process.env.BUCKET_NAME,
            list.memory_url,
          );
        }
      }

      return feed;
    } catch (error) {
      console.error('Failed to fetch user feed:', error);
      return [];
    }
  }
}
