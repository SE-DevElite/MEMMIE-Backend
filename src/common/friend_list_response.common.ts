import { BasicResponse } from './basic_response.common';
import { FriendLists } from '@/entities/friend_list.entity';

export class FriendListResponse extends BasicResponse {
  constructor(message: string, error: boolean, friend_list: FriendLists) {
    super(message, error);

    delete friend_list.user;
    this.friend_list = friend_list;
  }

  private friend_list: FriendLists;
}
