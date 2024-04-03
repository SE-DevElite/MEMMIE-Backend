import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './searchuser.controller';
import { SearchService } from './searchuser.service';
import { Users } from '@/entities/users.entity';
import { UserModule } from '../users/user.module';
import { FriendLists } from '@/entities/friend_list.entity';
import { FriendlistService } from '../friendlists/friendlist.service';
import { UserService } from '../users/user.service';
import { FollowService } from '../follows/follow.service';
import { AWSService } from '../aws/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, FriendLists]), UserModule],
  controllers: [SearchController],
  providers: [
    SearchService,
    FriendlistService,
    UserService,
    FollowService,
    AWSService,
  ],
  exports: [SearchService],
})
export class SearchModule {}
