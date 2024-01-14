import { Users } from '@/entities/users.entity';
import { BasicResponse } from './basic_response.common';

export class UserResponse extends BasicResponse {
  constructor(message: string, error: boolean, user: Users) {
    super(message, error);

    this.user = user;
  }

  private user: Users;
}
