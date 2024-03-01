import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { AuthenGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadDto } from '@/interfaces/IFileUpload';
import { validateOrReject } from 'class-validator';
import { UploadService } from './upload.service';
import { BasicResponse } from '@/common/basic_response.common';
import { AWSService } from '../aws/aws.service';

@Controller('api/uploads')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly awsService: AWSService,
  ) {}

  @Get('/:id')
  async testGet(@Param() params: { id: string }) {
    const url = this.awsService.s3_getObject(
      process.env.BUCKET_NAME,
      params.id,
    );
    return url;
  }

  @Post('/avatar')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    }),
  )
  async uploadFile(
    @Req() res,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BasicResponse> {
    const fileUploadDto = new ImageUploadDto();
    fileUploadDto.filename = file.originalname; // You can modify this based on your file requirements
    fileUploadDto.mimetype = file.mimetype;

    try {
      await validateOrReject(fileUploadDto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
    } catch (errors) {
      throw new BadRequestException(errors);
    }

    const encryptFileName = crypto.randomBytes(32).toString('hex');

    const uploadResponse = await this.awsService.s3_upload(
      file.buffer,
      process.env.BUCKET_NAME,
      encryptFileName,
      fileUploadDto.mimetype,
    );

    if (!uploadResponse) {
      return new BasicResponse('Upload failed', false);
    }

    const updateResponse = await this.uploadService.updateUserAvatar(
      res.user.id,
      encryptFileName,
    );

    if (!updateResponse) {
      return new BasicResponse('Upload failed', false);
    }

    return new BasicResponse('Upload success', true);
  }
}
