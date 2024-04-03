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

  async getAllFriendlist(user_id: string): Promise<FriendLists[] | null> {
    try {
      const res = await FriendLists.createQueryBuilder('friend_lists')
        .where('friend_lists.user_id = :user_id', { user_id })
        .leftJoinAndSelect('friend_lists.friend_id', 'users')
        .select([
          'friend_lists.friend_list_id',
          'friend_lists.name',
          'users.user_id',
          'users.avatar',
        ])
        .getMany();
      return res;
    } catch (err) {
      return null;
    }
  }

  async countFriendlist(
    user_id: string,
    friendList_id: string,
  ): Promise<number> {
    try {
      const res = await this.friendListRepositoy
        .createQueryBuilder('friend_lists')
        .leftJoinAndSelect('friend_lists.friend_id', 'users')
        .where('friend_lists.user_id = :user_id', { user_id })
        .andWhere('friend_lists.friend_list_id = :friendList_id', {
          friendList_id,
        })
        .getCount();

      return res;
    } catch (err) {
      return 0;
    }
  }

  async getFriendInList(
    user_id: string,
    friendList_id: string,
  ): Promise<Users[] | null> {
    try {
      const res = await this.friendListRepositoy
        .createQueryBuilder('friend_lists')
        .leftJoinAndSelect('friend_lists.friend_id', 'users')
        .where('friend_lists.user_id = :user_id', { user_id })
        .andWhere('friend_lists.friend_list_id = :friendList_id', {
          friendList_id,
        })
        .getMany();

      return res[0].friend_id;
    } catch (err) {
      return null;
    }
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

  async getAllFriends(user_id: string): Promise<Users[]> {
    try {
      const following = await this.followService.getFollowing(user_id);
      const followers = await this.followService.getFollower(user_id);

      const following_Ids = following.map((follow) => follow.following_id);
      const follower_Ids = followers.map((follow) => follow.user_id);

      const friend_Ids = following_Ids.filter((id) =>
        follower_Ids.includes(id),
      );
      const res = await Promise.all(
        friend_Ids.map((id) => this.usersService.getUserById(id)),
      );

      return res.filter(Boolean);
    } catch (err) {
      throw new Error('Failed to retrieve friends.');
    }
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

  async getFriendlistByUserID(user_id: string): Promise<FriendLists[] | null> {
    try {
      const res = await FriendLists.createQueryBuilder('friend_lists')
        .where('friend_lists.user_id = :user_id', { user_id })
        .getMany();
      return res;
    } catch (err) {
      return null;
    }
  }

  async updateFriendList(
    user_id: string,
    friendlist_id: string,
    friendlist_name: string,
    friend_id: string[],
  ): Promise<FriendLists | null> {
    const comparetest = await this.compareFollow2Gether(user_id, friend_id);
    if (!comparetest) {
      return null;
    }

    const friendList = await this.getFriendlistByID(user_id, friendlist_id);

    if (!friendList) {
      return null;
    }

    const friendList_id = await this.usersService.findManyUsersByIds(friend_id);

    friendList.friend_id = friendList_id;
    friendList.name = friendlist_name;

    try {
      await friendList.save();
      return friendList;
    } catch (err) {
      return null;
    }
  }

  async deleteFriendList(
    user_id: string,
    friendlist_id: string,
  ): Promise<boolean> {
    try {
      const friendlist = await this.getFriendlistByID(user_id, friendlist_id);

      if (!friendlist) {
        return false;
      }

      await this.friendListRepositoy.remove(friendlist);
      return true;
    } catch (err) {
      return false;
    }
  }
}
