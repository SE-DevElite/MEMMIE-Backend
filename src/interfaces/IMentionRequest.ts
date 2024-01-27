import { IsArray, IsUUID } from 'class-validator';

export class MentionBodyDto {
  @IsUUID()
  memory_id: string;

  @IsArray()
  friend_id: string[];
}
