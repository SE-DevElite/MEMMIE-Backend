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

@Module({
  imports: [TypeOrmModule.forFeature([Memories])],
  controllers: [MemoryController, DailyMemoryController],
  providers: [
    UserService,
    FriendlistService,
    AWSService,
    MemoryService,
    FollowService,
  ],
})
export class MemoryModule {}
