import { MemoryService } from './memory.service';
import { Query, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenGuard } from '../auth/auth.guard';
import { IJWT } from '@/interfaces/IAuthRequest';
import { filterMemoriesDto } from '@/interfaces/IFilterMemoryRequest';
import { MemoryManyResponse } from '@/common/memory_response.common';

@Controller('api/memories')
export class FilterMemoriesController {
  constructor(private memoryService: MemoryService) {}

  @Get('/filter')
  @UseGuards(AuthenGuard)
  async filterMemories(
    @Query() filter: filterMemoriesDto,
    @Req() req,
  ): Promise<MemoryManyResponse> {
    const user_data = req.user as IJWT;
    const filteredMemories = await this.memoryService.filterMemories(
      user_data.user_id,
      filter.mood,
      filter.weather,
      filter.start_date,
      filter.end_date,
    );

    return new MemoryManyResponse('Success', false, filteredMemories);
  }
}
