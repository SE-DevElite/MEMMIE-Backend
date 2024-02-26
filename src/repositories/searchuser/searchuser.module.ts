import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './searchuser.controller';
import { SearchService } from './searchuser.service';
import { Users } from '@/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
