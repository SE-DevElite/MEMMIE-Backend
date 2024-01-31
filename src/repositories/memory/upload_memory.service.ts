import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { AWSService } from '../aws/aws.service';
import { MemoryService } from './memory.service';
import { MemoryList } from '@/entities/memory_list.entity';
import { Memories } from '@/entities/memory_card.entity';

@Injectable()
export class UploadMemoryService {
  constructor(
    private memoryService: MemoryService,
    private awsService: AWSService,
  ) {}

  private createMemoryList(
    memory_id: Memories,
    memory_url: string,
  ): MemoryList {
    const memory_list = new MemoryList();
    memory_list.memory = memory_id;
    memory_list.memory_url = memory_url;

    return memory_list;
  }

  async uploadMemoryImage(
    memory_id: string,
    user_id: string,
    memory_image: Express.Multer.File,
  ) {
    const memory = await this.memoryService.getMemoryById(memory_id);
    if (!memory || memory.user.user_id !== user_id) {
      return null;
    }

    if (memory.memory_lists) {
      if (memory.memory_lists.length >= 10) {
        return null;
      }
    }

    const encryptFileName = crypto.randomBytes(32).toString('hex');
    const uploadResponse = await this.awsService.s3_upload(
      memory_image.buffer,
      process.env.BUCKET_NAME,
      encryptFileName,
      memory_image.mimetype,
    );
    if (!uploadResponse) {
      return null;
    }

    const res = this.createMemoryList(memory, encryptFileName);
    await res.save();

    return res;
  }
}
