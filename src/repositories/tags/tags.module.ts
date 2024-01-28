import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { UserService } from '../users/user.service';
import { AWSService } from '../aws/aws.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, UserService, AWSService],
})
export class TagsModule {}
