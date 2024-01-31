import { BasicResponse } from './basic_response.common';
import { Tags } from '@/entities/tags.entity';

export class TagResponse extends BasicResponse {
  constructor(message: string, error: boolean, tags: Tags[]) {
    super(message, error);

    this.tags = tags;
  }

  private tags: Tags[];
}
