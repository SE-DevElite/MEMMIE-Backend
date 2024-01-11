import { IsEmail, IsNotEmpty } from 'class-validator';

export interface IJWT {
  user_id: string;
  email: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class IServiceRequest extends Request {
  @IsNotEmpty()
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}
