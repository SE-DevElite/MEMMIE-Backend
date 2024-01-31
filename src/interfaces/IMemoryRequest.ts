import { DayEnum, MoodEnum, WeatherEnum } from '@/entities/memory_card.entity';
import { IsArray, IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MemoryParams {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  memory_id: string;
}

export class CreateMemoryDto {
  @IsString()
  @IsNotEmpty()
  @IsIn([MoodEnum.HAPPY, MoodEnum.NAH, MoodEnum.SAD, MoodEnum.FUNNY])
  mood: MoodEnum;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    WeatherEnum.CLOUDY,
    WeatherEnum.RAINY,
    WeatherEnum.SNOWY,
    WeatherEnum.SUNNY,
  ])
  weather: WeatherEnum;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    DayEnum.FRIDAY,
    DayEnum.MONDAY,
    DayEnum.SATURDAY,
    DayEnum.SUNDAY,
    DayEnum.THURSDAY,
    DayEnum.TUESDAY,
    DayEnum.WEDNESDAY,
  ])
  day: DayEnum;

  location_name?: string;

  @IsString()
  selected_datetime?: string;

  @IsString()
  @IsNotEmpty()
  caption: string;

  @IsString()
  short_caption?: string;

  @IsArray()
  mention?: string[];

  friend_list_id?: string;
}

export class UpdateMemoryDto extends CreateMemoryDto {}

export class deleteMemoryDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GetDailyMemoryDto {
  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  month: string;
}
