import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AlbumDto {
  @IsString()
  @IsNotEmpty()
  album_name: string;
}

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  album_name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  album_id: string;
}

export class DeleteAlbumDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  album_id: string;
}
