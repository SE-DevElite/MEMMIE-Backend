import { MemoryService } from './memory.service';
import {
  BadRequestException,
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
  UploadedFile,
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
import { MemoryResponse } from '@/common/memory_response.common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadDto } from '@/interfaces/IFileUpload';
import { validateOrReject } from 'class-validator';
import { BasicResponse } from '@/common/basic_response.common';

@Controller('api/memories')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Get(':memory_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getMemoryById(@Param() params: MemoryParams) {
    const res = await this.memoryService.getMemoryById(params.memory_id);

    if (!res) {
      return new BasicResponse('Memmory not found', false);
    }

    return new BasicResponse('Memory found', true);
  }

  @Post('/create')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMemoryById(@Req() req, @Body() body: CreateMemoryDto) {
    const user_data = req.user as IJWT;

    const res = await this.memoryService.createMemoryById(
      user_data.user_id,
      body.caption,
      body.short_caption,
      body.friend_list_id,
    );

    if (!res) {
      return new BasicResponse('Memory not found', true);
    }

    return new MemoryResponse('Memory created', true, res);
  }

  @Post('/upload/:memory_id')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2_000_000, // 2KB
      },
    }),
  )
  async uploadMemoryImage(
    @Req() req,
    @Param() param: MemoryParams,
    @UploadedFile() memory_image: Express.Multer.File,
  ) {
    const user_data = req.user as IJWT;
    console.log(user_data);

    if (memory_image == null || memory_image.buffer == null) {
      return new BasicResponse('Please upload image', true);
    }

    const fileUploadDto = new ImageUploadDto();
    fileUploadDto.filename = memory_image.originalname;
    fileUploadDto.mimetype = memory_image.mimetype;
    try {
      await validateOrReject(fileUploadDto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
    } catch (errors) {
      throw new BadRequestException(errors);
    }

    const res = await this.memoryService.uploadMemoryImage(
      user_data.user_id,
      param.memory_id,
      memory_image,
    );

    if (!res) {
      return new BasicResponse('Upload failed', true);
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
      body.caption,
      body.short_caption,
      body.friend_list_id,
    );

    return new MemoryResponse('Memory updated', true, res);
  }

  @Delete(':memory_id')
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
}
