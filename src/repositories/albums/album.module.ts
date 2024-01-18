import { UserService } from '@/repositories/users/user.service';
import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Users } from '@/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Albums } from '@/entities/albums.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Albums])],
  controllers: [AlbumController],
  providers: [AlbumService, UserService],
})
export class AlbumModule {}
