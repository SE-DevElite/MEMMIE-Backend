import { IsNotEmpty, IsString } from 'class-validator';

export class SearchParams {
  @IsString()
  @IsNotEmpty()
  query: string;
}
