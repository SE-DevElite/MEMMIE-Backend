import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './searchuser.service';
import { Users } from '@/entities/users.entity';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('users')
  async searchUsers(@Query('query') query: string): Promise<Users[]> {
    return this.searchService.searchUsers(query);
  }
}
