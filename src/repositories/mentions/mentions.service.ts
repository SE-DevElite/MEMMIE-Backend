import { Mentions } from '@/entities/mention.entity';
import { Injectable } from '@nestjs/common';
import { FollowService } from '../follows/follow.service';

@Injectable()
export class MentionsService {
  constructor(private readonly followService: FollowService) {}

  async getAllMemoryMentions(memory_id: string) {
    const res = await Mentions.createQueryBuilder('mentions')
      .where('mentions.memory_id = :memory_id', { memory_id })
      .innerJoinAndSelect('mentions.memory', 'memory')
      .innerJoinAndSelect('memory.user', 'user')
      .getMany();

    return res;
  }

  async getFriendCanMention(user_id: string) {
    try {
      const friends = await this.followService.getFollowing(user_id);

      return friends;
    } catch (err) {
      return null;
    }
  }

  async updateMention(user_id: string, memory_id: string, friend_id: string[]) {
    try {
      const prev_mentions = await this.getAllMemoryMentions(memory_id);

      for (const mention of prev_mentions) {
        if (mention.memory.user.user_id === user_id) {
          await mention.remove();
        } else {
          return "You don't have permission to update this memory";
        }
      }

      for (const friend of friend_id) {
        await Mentions.createQueryBuilder('mentions')
          .insert()
          .into(Mentions)
          .values({ memory_id, friend_id: friend })
          .execute();
      }

      return true;
    } catch (err) {
      console.log(err);
      return 'update mention error';
    }
  }
}
