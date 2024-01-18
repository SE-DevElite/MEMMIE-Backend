import { MemoryService } from './memory.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { MemoryResponse } from '@/common/memory_response.common';

@Controller('api/memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMemoryById(@Param() params) {
    const res = await this.memoryService.getMemoryById(params.id);

    if (!res) {
      return new MemoryResponse('Memmory not found', false, null);
    }

    return new MemoryResponse('Memory found', true, res);
  }

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async createMemoryById(@Param() params, @Body() body) {
    const res = await this.memoryService.createMemoryById(
      params.id,
      body.user_id,
      body.email,
      body.caption,
      body.short_caption,
      body.friend_list,
    );

    return new MemoryResponse('Memory created', true, res);
  }

  @Post(':id')
  @HttpCode(204)
    async updateMemoryById(@Param() params, @Body() body) {
    const res = await this.memoryService.updateMemoryById(
      params.id,
      body.user_id,
      body.email,
      body.caption,
      body.short_caption,
      body.friend_list,
    );

    return new MemoryResponse('Memory updated', true, res);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteMemoryById(@Param() params) {
    const res = await this.memoryService.deleteMemoryById(params.id);

    return new MemoryResponse('Memory deleted', true, res);
  }


}
