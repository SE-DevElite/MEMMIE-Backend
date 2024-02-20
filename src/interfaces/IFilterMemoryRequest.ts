import { IsString, IsUUID, IsIn, IsDate } from 'class-validator';
import { MoodEnum, WeatherEnum } from '@/entities/memory_card.entity';

export class filterMemoriesDto {
  @IsString()
  @IsUUID()
  user_id: string;

  @IsString()
  @IsIn([MoodEnum.HAPPY, MoodEnum.NAH, MoodEnum.SAD, MoodEnum.FUNNY])
  mood: MoodEnum;

  @IsString()
  @IsIn([
    WeatherEnum.CLOUDY,
    WeatherEnum.RAINY,
    WeatherEnum.SNOWY,
    WeatherEnum.SUNNY,
  ])
  weather: WeatherEnum;

  @IsString()
  @IsUUID()
  album_id: string;

  @IsDate()
  date1: Date;

  @IsDate()
  date2: Date;
}
