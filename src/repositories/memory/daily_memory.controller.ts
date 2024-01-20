import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MemoryService } from '../memory/memory.service';
import { AuthenGuard } from '../auth/auth.guard';
import { GetDailyMemoryDto } from '@/interfaces/IMemoryRequest';
import { IJWT } from '@/interfaces/IAuthRequest';
import { DailyMemoryResponse } from '@/common/daily_memory_response.common';
import { AWSService } from '../aws/aws.service';

@Controller('api/daily-memory')
export class DailyMemoryController {
  constructor(
    private readonly memoryService: MemoryService,
    private readonly awsService: AWSService,
  ) {}
  DAY: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  @Get('/:year/:month')
  @UseGuards(AuthenGuard)
  @HttpCode(HttpStatus.OK)
  async getDailyMemory(@Param() params: GetDailyMemoryDto, @Req() req) {
    const { year, month } = params;
    const user_data = req.user as IJWT;
    const res = await this.memoryService.getMemoryByYearAndMonth(
      user_data.user_id,
      year,
      month,
    );

    for (const memory of res) {
      const image = await this.awsService.s3_getObject(
        process.env.BUCKET_NAME,
        memory.memory_image,
      );
      memory.memory_image = image;
    }

    const intYear = parseInt(year);
    const intMonth = parseInt(month);

    const collect_date: any[] = [];
    const firstDate = new Date(intYear, intMonth - 1, 1).getDate();
    const amountDate = new Date(intYear, intMonth, 0).getDate();
    const padding = new Date(intYear, intMonth - 1, 0).getDay();

    for (let i = 0; i < padding; i++) {
      collect_date.push({
        date: '',
        day: '',
        memories: [],
      });
    }

    for (let i = firstDate; i <= amountDate; i++) {
      collect_date.push({
        date: i,
        day: this.DAY[new Date(intYear, intMonth - 1, i).getDay()],
        memories: [],
      });
    }

    res.map((memory) => {
      const date = new Date(memory.created_at).getDate();
      const day = this.DAY[new Date(memory.created_at).getDay()];
      const index = collect_date.findIndex(
        (item) => item.date === date && item.day === day,
      );
      if (index !== -1) {
        collect_date[index].memories.push(memory);
      }
    });

    const sliceDate: any[][] = [];
    for (let i = 0; i < collect_date.length; i += 7) {
      sliceDate.push(collect_date.slice(i, i + 7));
    }

    if (sliceDate[4].length < 7) {
      for (let i = sliceDate[4].length; i < 7; i++) {
        sliceDate[4].push({
          date: '',
          day: '',
          memories: [],
        });
      }
    }

    return new DailyMemoryResponse(
      'Get daily memory successfully',
      false,
      sliceDate,
    );
  }
}
