import { Memories } from '@/entities/memory_card.entity';
import { BasicResponse } from './basic_response.common';

export class MemoryResponse extends BasicResponse {
  constructor(message: string, error: boolean, memory: Memories) {
    super(message, error);

    this.memory = memory;
  }

  private memory: Memories;
}
