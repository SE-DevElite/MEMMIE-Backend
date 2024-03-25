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

export class ManyUserResponse extends BasicResponse {
  constructor(message: string, error: boolean, user: Users[], streak: number) {
    super(message, error);

    this.user = user;
    this.streak = streak;
  }

  private user: Users[];
  private streak: number;
}

export class AllFriendResponse extends BasicResponse {
  constructor(message: string, error: boolean, user: Users[]) {
    super(message, error);
    this.user = user;
  }

  private user: Users[];
}
