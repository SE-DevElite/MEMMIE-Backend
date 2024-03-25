import { MemoryService } from './memory.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateMemoryDto,
  MemoryParams,
  UpdateMemoryDto,
} from '@/interfaces/IMemoryRequest';
import { IJWT } from '@/interfaces/IAuthRequest';
import { AuthenGuard } from '../auth/auth.guard';
import {
  MemoryManyResponse,
  MemoryResponse,
} from '@/common/memory_response.common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BasicResponse } from '@/common/basic_response.common';
import { UploadMemoryService } from './upload_memory.service';

@Controller('api/memories')
export class MemoryController {
  constructor(
    private readonly memoryService: MemoryService,
    private readonly uploadMemoryService: UploadMemoryService,
  ) {}

  // @Get(':memory_id')
  // @UseGuards(AuthenGuard)
  // @HttpCode(HttpStatus.OK)
  // async getMemoryById(@Param() params: MemoryParams) {
  //   const res = await this.memoryService.getMemoryById(params.memory_id);

  //   if (!res) {
  //     return new BasicResponse('Memmory not found', false);
  //   }

  //   return new BasicResponse('Memory found', true);
  // }

  @Get('/user')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getMemoryByUserId(@Req() req) {
    const user_data = req.user as IJWT;

    const res = await this.memoryService.getMemoryByUserId(user_data.user_id);

    if (!res) {
      return new BasicResponse('Memmory not found', false);
    }

    return new MemoryManyResponse('Memory found', true, res);
  }

  @Get('/feed')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getMemoryFeed(@Req() req) {
    const user_data = req.user as IJWT;

    const res = await this.memoryService.getUserFeed(user_data.user_id);

    if (!res) {
      return new BasicResponse('Memmory not found', false);
    }

    return new MemoryManyResponse('Memory found', true, res);
  }

  @Post('/create')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMemoryById(@Req() req, @Body() body: CreateMemoryDto) {
    const user_data = req.user as IJWT;

    const res = await this.memoryService.createMemory(
      user_data.user_id,
      body.mood,
      body.weather,
      body.day,
      body.selected_datetime,
      body.caption,
      body.short_caption,
      body.mention,
      body.friend_list_id,
      body.location_name,
      body.lat,
      body.long,
      body.privacy,
    );

    if (!res) {
      return new BasicResponse('Can not create memory', true);
    }

    return new MemoryResponse('Memory created', false, res);
  }

  @Post('/upload/:memory_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async uploadMemoryImage(
    @Req() req,
    @Param() param: MemoryParams,
    @UploadedFiles() memory_images: Array<Express.Multer.File>,
  ) {
    const user_data = req.user as IJWT;

    for (const memory_image of memory_images) {
      if (memory_image.buffer == null) {
        return new BasicResponse('Please upload image', true);
      }

      const res = await this.uploadMemoryService.uploadMemoryImage(
        param.memory_id,
        user_data.user_id,
        memory_image,
      );

      if (!res) {
        return new BasicResponse('Upload failed', true);
      }
    }

    return new BasicResponse('Upload success', false);
  }

  @Patch('/update/:memory_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async updateMemoryById(
    @Req() req,
    @Param() params: MemoryParams,
    @Body() body: UpdateMemoryDto,
  ) {
    const user_data = req.user as IJWT;

    const res = await this.memoryService.updateMemoryById(
      params.memory_id,
      user_data.user_id,
      body.mood,
      body.weather,
      body.day,
      body.selected_datetime,
      body.caption,
      body.short_caption,
      body.mention,
      body.friend_list_id,
      body.location_name,
      body.lat,
      body.long,
      body.privacy,
    );

    if (!res) {
      return new BasicResponse('Memory not found', true);
    }

    return new MemoryResponse('Memory updated', false, res);
  }

  @Delete('/delete/:memory_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async deleteMemoryById(@Req() req, @Param() params: MemoryParams) {
    const user_data = req.user as IJWT;

    const res = await this.memoryService.deleteMemoryById(
      params.memory_id,
      user_data.user_id,
    );

    if (!res) {
      return new BasicResponse('Memory not found', true);
    }

    return new BasicResponse('Memory deleted', false);
  }

  @Patch('/images/update/:memory_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async updateMemoryImage(
    @Req() req,
    @Param() param: MemoryParams,
    @UploadedFiles() memory_images: Array<Express.Multer.File>,
  ) {
    const user_data = req.user as IJWT;

    const res = await this.memoryService.deleteAllMemoryImageById(
      param.memory_id,
    );

    console.log(memory_images);

    if (!res) {
      return new BasicResponse('Can not delete memory image', true);
    }

    for (const memory_image of memory_images) {
      if (memory_image.buffer == null) {
        return new BasicResponse('Please upload image', true);
      }

      const res = await this.uploadMemoryService.uploadMemoryImage(
        param.memory_id,
        user_data.user_id,
        memory_image,
      );

      if (!res) {
        return new BasicResponse('Upload failed', true);
      }
    }
  }
}
