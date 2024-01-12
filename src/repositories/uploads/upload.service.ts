import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';

@Injectable()
export class UploadService {
  constructor(private usersService: UserService) {}

  async updateUserAvatar(user_id: string, avatarName: string) {
    const user = await this.usersService.getUserById(user_id);

    if (!user) {
      return null;
    }

    user.avatar = avatarName;

    try {
      await user.save();
      return user;
    } catch (e) {
      return null;
    }
  }
}
