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

    const selected_field = ['user_id', 'name', 'username', 'avatar'];

    const user_select_field = user.map((u) => {
      const new_user = new Users();
      selected_field.forEach((field) => {
        new_user[field] = u[field];
      });

      return new_user;
    });

    this.user = user_select_field;
  }

  private user: Users[];
}
