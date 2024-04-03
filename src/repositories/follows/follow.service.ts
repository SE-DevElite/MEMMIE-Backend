import { Follows } from '@/entities/follows.entity';
import { Users } from '@/entities/users.entity';
import { Injectable } from '@nestjs/common';
import { UserService } from '@/repositories/users/user.service';

@Injectable()
export class FollowService {
  constructor(private usersService: UserService) {}

  private createFollow(user: Users, follow_id: Users): Follows {
    const follow = new Follows();

    follow.user = user;
    follow.following = follow_id;

    return follow;
  }

  async isFollow(user_id: string, follow_id: string): Promise<boolean> {
    const isFollow = await Follows.createQueryBuilder('follows')
      .where('follows.user_id = :user_id', { user_id })
      .andWhere('follows.following_id = :follow_id', { follow_id })
      .getOne();

    return !!isFollow;
  }

  async getFollowing(user_id: string): Promise<Follows[]> {
    const res = await Follows.find({
      where: { user_id },
    });

    return res;
  }

  async getFollower(user_id: string): Promise<Follows[]> {
    const res = await Follows.find({
      where: { following_id: user_id },
    });

    return res;
  }

  async followOrUnfollow(
    user_id: string,
    follow_id: string,
  ): Promise<string | null> {
    try {
      const isFollow = await Follows.createQueryBuilder('follows')
        .where('follows.user_id = :user_id', { user_id })
        .andWhere('follows.following_id = :follow_id', { follow_id })
        .getOne();

      if (isFollow) {
        await isFollow.remove();
        return 'Unfollow';
      }

      const currentUser = await this.usersService.getUserById(user_id);
      const followUser = await this.usersService.getUserById(follow_id);

      if (!currentUser || !followUser) {
        return null;
      }

      const follow = this.createFollow(currentUser, followUser);
      const res = await follow.save();

      return res ? 'Follow' : null;
    } catch (err) {
      return null;
    }
  }
}
