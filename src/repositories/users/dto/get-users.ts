import { IsEmail, IsOptional, IsString } from 'class-validator';

export class QueryParamsUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username: string;
}
