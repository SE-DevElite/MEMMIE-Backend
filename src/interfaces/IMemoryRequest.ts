import {
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class getMemoryByIdDto {
    @IsString()
    @IsNotEmpty()
    id: string;
  }
  
  export class createMemoryDto {
    @IsEmail()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    id: string;
  }

  export class updateMemoryDto {
    @IsEmail()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    id: string;
  }

  export class deleteMemoryDto {
    @IsEmail()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    id: string;
  }