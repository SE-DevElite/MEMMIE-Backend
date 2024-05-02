import { Module } from '@nestjs/common';
import { FriendlistController } from './friendlist.controller';
import { FriendlistService } from './friendlist.service';
import { Users } from '@/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';
import { FriendLists } from '@/entities/friend_list.entity';
import { AWSService } from '../aws/aws.service';
import { FollowService } from '../follows/follow.service';
import { Memories } from '@/entities/memory_card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, FriendLists, Memories])],
  controllers: [FriendlistController],
  providers: [FriendlistService, UserService, AWSService, FollowService],
})
export class FriendlistModule {}
