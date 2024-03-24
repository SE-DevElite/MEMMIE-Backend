import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BodyAlbumDto {
  @IsString()
  @IsNotEmpty()
  album_name: string;

  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @IsArray()
  memories: string[];
}

export class ParamsAlbumDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  album_id: string;
}
