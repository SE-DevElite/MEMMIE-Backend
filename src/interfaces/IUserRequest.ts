import { GenderEnum } from '@/entities/users.entity';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ParamsUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class BodyUserDto {
  // @IsEmail()
  // @IsNotEmpty()
  // email: string;

  // @IsString()
  // @MinLength(4)
  // @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  // password?: string;

  @IsString()
  name?: string;

  @IsString()
  username?: string;

  @IsString()
  bio?: string;

  @IsIn([GenderEnum.FEMALE, GenderEnum.MALE, GenderEnum.OTHER])
  gender?: GenderEnum;
}
