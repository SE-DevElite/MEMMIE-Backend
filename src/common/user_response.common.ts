import { Users } from '@/entities/users.entity';
import { BasicResponse } from './basic_response.common';

export class UserResponse extends BasicResponse {
  constructor(message: string, error: boolean, user: Users, streak: number) {
    super(message, error);

    this.user = user;
    this.streak = streak;
  }

  private user: Users;
  private streak: number;
}
