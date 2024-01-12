import { UserService } from '@/repositories/users/user.service';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { Users } from '@/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [FollowController],
  providers: [FollowService, UserService],
})
export class FollowModule {}
