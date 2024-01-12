import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class AvatarUploadDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim()) // Trim the filename
  filename: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['image/png', 'image/jpeg', 'image/jpg'], {
    message: 'Only PNG, JPEG, and JPG images are allowed.',
  })
  mimetype: string;
}
