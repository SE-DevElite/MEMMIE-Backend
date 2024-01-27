import { Module } from '@nestjs/common';
import { MentionsController } from './mentions.controller';
import { MentionsService } from './mentions.service';
import { FollowService } from '../follows/follow.service';
import { UserService } from '../users/user.service';

@Module({
  controllers: [MentionsController],
  providers: [MentionsService, FollowService, UserService],
})
export class MentionsModule {}
