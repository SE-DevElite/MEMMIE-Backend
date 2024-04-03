import {
  Controller,
  Get,
  Query,
  HttpCode,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { SearchService } from './searchuser.service';
import { Users } from '@/entities/users.entity';
import { AuthenGuard } from '../auth/auth.guard';
import { IJWT } from '@/interfaces/IAuthRequest';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('users')
  @UseGuards(AuthenGuard)
  async searchUsers(
    @Req() req,
    @Query('query') query: string,
  ): Promise<Users[]> {
    const user_data = req.user as IJWT;

    return this.searchService.searchUsers(query, user_data.user_id);
  }

  @Get('friends')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async searchFriend(
    @Query('query') query: string,
    @Req() req,
  ): Promise<Users[]> {
    const user_data = req.user as IJWT;
    return this.searchService.searchFriendsOfUser(user_data.user_id, query);
  }
}
