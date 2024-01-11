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

  async followOrUnfollow(
    users_id: string,
    follow_id: string,
  ): Promise<Follows> {
    try {
      const currentUser = await this.usersService.getUserById(users_id);
      const followUser = await this.usersService.getUserById(follow_id);

      if (!currentUser || !followUser) {
        return null;
      }

      const isFollow = await Follows.findOne({
        where: {
          user: currentUser,
          following: followUser,
        },
        relations: ['user', 'following'],
      });

      console.log(isFollow);

      // const follow = this.createFollow(currentUser, followUser);
      // const res = await follow.save();

      // return res;
    } catch (err) {
      return null;
    }
  }
}
