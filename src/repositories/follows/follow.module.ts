import { UserService } from '@/repositories/users/user.service';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { Users } from '@/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follows } from '@/entities/follows.entity';
import { AWSService } from '../aws/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Follows])],
  controllers: [FollowController],
  providers: [FollowService, UserService, AWSService],
})
export class FollowModule {}
