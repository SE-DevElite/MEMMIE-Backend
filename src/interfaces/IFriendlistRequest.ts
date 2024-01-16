import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BodyFriendlistDto {
  @IsString()
  @IsNotEmpty()
  friendlist_name: string;
}

export class ParamsFriendlistDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  friendlist_id: string;
}
