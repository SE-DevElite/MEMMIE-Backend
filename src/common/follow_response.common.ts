import { Follows } from '@/entities/follows.entity';
import { BasicResponse } from './basic_response.common';

export class FollowResponse extends BasicResponse {
  constructor(message: string, error: boolean, follows: Follows[]) {
    super(message, error);

    this.follows = follows;
  }

  private follows: Follows[];
}
