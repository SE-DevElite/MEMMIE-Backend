import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MemoryParams {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  memory_id: string;
}

export class CreateMemoryDto {
  @IsString()
  caption: string;

  @IsString()
  short_caption?: string;

  @IsString()
  friend_list_id: string;
}

export class UpdateMemoryDto {
  @IsString()
  caption?: string;

  @IsString()
  short_caption?: string;

  @IsUUID()
  @IsString()
  friend_list_id?: string;
}

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
