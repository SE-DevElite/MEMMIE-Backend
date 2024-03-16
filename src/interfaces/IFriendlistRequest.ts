import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BodyFriendlistDto {
  @IsString()
  @IsNotEmpty()
  friendlist_name: string;

  @IsArray()
  friendlist_id: string[];
}

export class ParamsFriendlistDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  friendlist_id: string;
}
