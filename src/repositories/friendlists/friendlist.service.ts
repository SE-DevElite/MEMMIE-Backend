import { Injectable } from '@nestjs/common';
import { FriendLists } from '@/entities/friend_list.entity';
import { UserService } from '../users/user.service';
import { Users } from '@/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowService } from '../follows/follow.service';

@Injectable()
export class FriendlistService {
  constructor(
    private usersService: UserService,
    private followService: FollowService,

    @InjectRepository(FriendLists)
    private friendListRepositoy: Repository<FriendLists>,
  ) {}

  private createFriendlist(user: Users, friendlist_name: string): FriendLists {
    const friendlist = new FriendLists();
    friendlist.name = friendlist_name;
    friendlist.user = user;

    return friendlist;
  }

  async compareFollow2Gether(
    user_id: string,
    friend_id: string[],
  ): Promise<boolean> {
    const user_following = await this.followService.getFollowing(user_id);

    for (let i = 0; i < friend_id.length; i++) {
      const res = user_following.find(
        (following) => following.following_id === friend_id[i],
      );

      if (!res) {
        return false;
      }
    }

    const follower_user = await this.followService.getFollower(user_id);

    for (let i = 0; i < friend_id.length; i++) {
      const res = follower_user.find(
        (follower) => follower.user_id === friend_id[i],
      );

      if (!res) {
        return false;
      }
    }

    return true;
  }

  async saveFriendlist(
    user_id: string,
    friendlist_name: string,
    friend_id: string[],
  ): Promise<FriendLists | null> {
    const comparetest = await this.compareFollow2Gether(user_id, friend_id);
    if (!comparetest) {
      return null;
    }

    const user = await this.usersService.getUserById(user_id);

    if (!user) {
      return null;
    }
    const friendList_id = await this.usersService.findManyUsersByIds(friend_id);

    const friendlist = this.friendListRepositoy.create({
      name: friendlist_name,
      user,
      friend_id: friendList_id,
    });

    try {
      await friendlist.save();
      return friendlist;
    } catch (err) {
      return null;
    }
  }

  async getFriendlistByID(
    user_id: string,
    friendlist_id: string,
  ): Promise<FriendLists | null> {
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

  // async updateFriendlist(
  //   user_id: string,
  //   friendlist_name: string,
  //   friendlist_id: string,
  // ): Promise<FriendLists | null> {
  //   const friendlist = await this.getFriendlistByID(user_id, friendlist_id);
  //   friendlist.name = friendlist_name;

  //   try {
  //     await friendlist.save();
  //     return friendlist;
  //   } catch (err) {
  //     return null;
  //   }
  // }

  // async deleteFriendlist(
  //   user_id: string,
  //   friendlist_id: string,
  // ): Promise<FriendLists | null> {
  //   const friendlist = await this.getFriendlistByID(user_id, friendlist_id);

  //   try {
  //     const res = await friendlist.remove();

  //     if (!res) {
  //       return null;
  //     }

  //     return friendlist;
  //   } catch (err) {
  //     return null;
  //   }
  // }
}
