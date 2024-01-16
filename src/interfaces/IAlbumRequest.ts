import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BodyAlbumDto {
  @IsString()
  @IsNotEmpty()
  album_name: string;
}

export class ParamsAlbumDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  album_id: string;
}
