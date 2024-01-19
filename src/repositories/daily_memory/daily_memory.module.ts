import { Module } from '@nestjs/common';
import { DailyMemoryController } from './daily_memory.controller';
import { MemoryService } from '../memory/memory.service';
import { AWSService } from '../aws/aws.service';
import { UserService } from '../users/user.service';
import { FriendlistService } from '../friendlists/friendlist.service';

@Module({
  controllers: [DailyMemoryController],
  providers: [MemoryService, FriendlistService, AWSService, UserService],
})
export class DailyMemoryModule {}
