import { Follows } from '@/entities/follows.entity';
import { Users } from '@/entities/users.entity';
import { Injectable } from '@nestjs/common';
import { UserService } from '@/repositories/users/user.service';

@Injectable()
export class FollowService {
  constructor(private usersService: UserService) {}

  private createFollow(users_id: Users, follow_id: Users) {
    const follow = new Follows();

    follow.user = users_id;
    follow.following = follow_id;

    return follow;
  }

  async getFollowing(user_id: string): Promise<Follows[]> {
    const res = await Follows.find({
      where: { user_id },
    });

    return res;
  }

  async followOrUnfollow(
    users_id: string,
    follow_id: string,
  ): Promise<string | null> {
    try {
      const isFollow = await Follows.createQueryBuilder('follows')
        .where('follows.user_id = :users_id', { users_id })
        .andWhere('follows.following_id = :follow_id', { follow_id })
        .getOne();

      if (isFollow) {
        await isFollow.remove();
        return 'Unfollow';
      }

      const currentUser = await this.usersService.getUserById(users_id);
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
