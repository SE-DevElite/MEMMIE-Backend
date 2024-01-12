import { Users } from '@/entities/users.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UserService } from '../users/user.service';
import { AWSService } from '../aws/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UploadController],
  providers: [UserService, AWSService, UploadService],
})
export class UploadModule {}
