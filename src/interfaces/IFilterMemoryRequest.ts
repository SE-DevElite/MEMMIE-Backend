import { IsIn, IsDateString, IsOptional } from 'class-validator';
import { MoodEnum, WeatherEnum } from '@/entities/memory_card.entity';

export class filterMemoriesDto {
  @IsOptional()
  @IsIn([MoodEnum.HAPPY, MoodEnum.NAH, MoodEnum.SAD, MoodEnum.FUNNY])
  mood?: MoodEnum | null;

  @IsOptional()
  @IsIn([
    WeatherEnum.CLOUDY,
    WeatherEnum.CLEARSKY,
    WeatherEnum.DOWNPOUR,
    WeatherEnum.SUNNY,
    WeatherEnum.SNOWFLAKE,
  ])
  weather?: WeatherEnum | null;

  @IsDateString()
  start_date?: Date;

  @IsDateString()
  end_date?: Date;
}
