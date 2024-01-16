import { UserService } from '@/repositories/users/user.service';
import { Module } from '@nestjs/common';
import { FriendlistController } from './friendlist.controller';
import { FriendlistService } from './friendlist.service';
import { Users } from '@/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [FriendlistController],
  providers: [FriendlistService, UserService],
})
export class FriendlistModule {}
