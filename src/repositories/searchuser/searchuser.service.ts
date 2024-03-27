import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@/entities/users.entity';
import { FriendlistService } from '../friendlists/friendlist.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private friendlistService: FriendlistService,
  ) {}

  async searchUsers(query: string): Promise<Users[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) LIKE LOWER(:query)', {
        query: `%${query}%`,
      })
      .getMany();
  }

  async searchFriendsOfUser(user_id: string, query: string): Promise<Users[]> {
    try {
      const friends = await this.friendlistService.getAllFriends(user_id);

      const filteredFriends = friends.filter((friend) =>
        friend.username.toLowerCase().includes(query.toLowerCase()),
      );

      return filteredFriends;
    } catch (err) {
      throw new Error('Failed to retrieve friends.');
    }
  }
}
