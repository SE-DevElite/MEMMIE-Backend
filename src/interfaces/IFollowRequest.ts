import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FollowDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  follow_id: string;
}
