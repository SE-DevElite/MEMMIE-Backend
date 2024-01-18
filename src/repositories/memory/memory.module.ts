import { Memories } from '@/entities/memory_card.entity';
import {
  Module
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryController } from './memory.controller';
import { MemoryService } from './memory.service';
import { AuthMiddleware } from '@/middleware/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Memories])],
  controllers: [MemoryController],
  providers: [MemoryService],
})
export class MemoryModule {
  
}