import { MemoryService } from './memory.service';
import { Query, Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenGuard } from '../auth/auth.guard';
import { IJWT } from '@/interfaces/IAuthRequest';
import { filterMemoriesDto } from '@/interfaces/IFilterMemoryRequest';
import { Memories } from '@/entities/memory_card.entity';

@Controller('memories')
export class MemoriesController {
  constructor(private memoryService: MemoryService) {}

  @Get('query')
  @UseGuards(AuthenGuard)
  async filterMemories(
    @Query() filter: filterMemoriesDto,
    @Req() req,
  ): Promise<Memories[]> {
    const user_data = req.user as IJWT;
    const filteredMemories = await this.memoryService.filterMemories(
      user_data.user_id,
      filter.mood,
      filter.weather,
      filter.album_id,
      filter.date1,
      filter.date2,
    );
    return filteredMemories;
  }
}
