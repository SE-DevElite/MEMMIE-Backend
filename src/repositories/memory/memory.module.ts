import { Memories } from '@/entities/memory_card.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryController } from './memory.controller';
import { MemoryService } from './memory.service';
import { UserService } from '../users/user.service';
import { FriendlistService } from '../friendlists/friendlist.service';
import { AWSService } from '../aws/aws.service';
import { DailyMemoryController } from './daily_memory.controller';
import { FollowService } from '../follows/follow.service';
import { Users } from '@/entities/users.entity';
import { UploadMemoryService } from './upload_memory.service';
import { FilterMemoriesController } from './filter_memory.controller';
import { MemoryList } from '@/entities/memory_list.entity';
import { FriendLists } from '@/entities/friend_list.entity';
import { Follows } from '@/entities/follows.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Memories,
      Users,
      MemoryList,
      FriendLists,
      Follows,
    ]),
  ],
  controllers: [
    MemoryController,
    DailyMemoryController,
    FilterMemoriesController,
  ],
  providers: [
    UserService,
    FriendlistService,
    AWSService,
    MemoryService,
    FollowService,
    UploadMemoryService,
  ],
})
export class MemoryModule {}
