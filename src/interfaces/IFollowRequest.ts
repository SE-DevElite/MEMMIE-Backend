import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BodyFollowDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  follow_id: string;
}
