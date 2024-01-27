import { Follows } from '@/entities/follows.entity';
import { BasicResponse } from './basic_response.common';

export class MentionResponse extends BasicResponse {
  constructor(message: string, error: boolean, following: Follows[]) {
    super(message, error);

    this.friend = following;
  }

  private friend: Follows[];
}
