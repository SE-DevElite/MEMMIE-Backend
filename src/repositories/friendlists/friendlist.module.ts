import { Module } from '@nestjs/common';
import { FriendlistController } from './friendlist.controller';
import { FriendlistService } from './friendlist.service';
import { Users } from '@/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [FriendlistController],
  providers: [FriendlistService, UserService],
})
export class FriendlistModule {}
