import { IsNotEmpty, IsString } from 'class-validator';

export class TagBodyDto {
  @IsString()
  @IsNotEmpty()
  tag_name: string;
}

export class TagParamsDto {
  @IsString()
  @IsNotEmpty()
  tag_id: string;
}
