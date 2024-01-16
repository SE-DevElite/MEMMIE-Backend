import { Injectable } from '@nestjs/common';
import { FriendLists } from '@/entities/friend_list.entity';

@Injectable()
export class FriendlistService {
  private createFriendlist(friendlist_name: string) {
    const friendlist = new FriendLists();
    friendlist.name = friendlist_name;
    return friendlist;
  }

  async saveFriendlist(friendlist_name: string) {
    const friendlist = this.createFriendlist(friendlist_name);
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

  async getFriendlistByID(friendlist_id: string) {
    try {
      const res = await FriendLists.createQueryBuilder('friend_lists')
        .where('friend_lists.friend_list_id = :friendlist_id', {
          friendlist_id,
        })
        .getOne();
      return res;
    } catch (err) {
      return null;
    }
  }

  async updateFriendlist(friendlist_name: string, friendlist_id: string) {
    const friendlist = await this.getFriendlistByID(friendlist_id);
    friendlist.name = friendlist_name;

    try {
      await friendlist.save();
      return friendlist;
    } catch (err) {
      return null;
    }
  }

  async deleteFriendlist(friendlist_id: string) {
    const friendlist = await this.getFriendlistByID(friendlist_id);

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
