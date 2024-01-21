import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { UserService } from '../users/user.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, UserService],
})
export class TagsModule {}
