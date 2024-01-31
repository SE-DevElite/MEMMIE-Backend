import { UserService } from '@/repositories/users/user.service';
import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Albums } from '@/entities/albums.entity';
import { AWSService } from '../aws/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([Albums])],
  controllers: [AlbumController],
  providers: [AlbumService, UserService, AWSService],
})
export class AlbumModule {}
