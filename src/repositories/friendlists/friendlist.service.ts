import { Injectable } from '@nestjs/common';
import { FriendLists } from '@/entities/friend_list.entity';
import { UserService } from '../users/user.service';
import { Users } from '@/entities/users.entity';

@Injectable()
export class FriendlistService {
  constructor(private usersService: UserService) {}

  private createFriendlist(user: Users, friendlist_name: string) {
    const friendlist = new FriendLists();
    friendlist.name = friendlist_name;
    friendlist.user = user;

    return friendlist;
  }

  async saveFriendlist(user_id: string, friendlist_name: string) {
    const user = await this.usersService.getUserById(user_id);

    if (!user) {
      return null;
    }

    const friendlist = this.createFriendlist(user, friendlist_name);
    try {
      const res = await friendlist.save();
      if (!res) {
        return null;
      }
      return friendlist;
    } catch (err) {
      return null;
    }
  }

  async getFriendlistByID(user_id: string, friendlist_id: string) {
    try {
      const res = await FriendLists.createQueryBuilder('friend_lists')
        .where('friend_lists.friend_list_id = :friendlist_id', {
          friendlist_id,
        })
        .andWhere('friend_lists.user_id = :user_id', { user_id })
        .getOne();
      return res;
    } catch (err) {
      return null;
    }
  }

  async updateFriendlist(
    user_id: string,
    friendlist_name: string,
    friendlist_id: string,
  ) {
    const friendlist = await this.getFriendlistByID(user_id, friendlist_id);
    friendlist.name = friendlist_name;

    try {
      await friendlist.save();
      return friendlist;
    } catch (err) {
      return null;
    }
  }

  async deleteFriendlist(user_id: string, friendlist_id: string) {
    const friendlist = await this.getFriendlistByID(user_id, friendlist_id);

    try {
      const res = await friendlist.remove();

      if (!res) {
        return null;
      }

      return friendlist;
    } catch (err) {
      return null;
    }
  }
}
