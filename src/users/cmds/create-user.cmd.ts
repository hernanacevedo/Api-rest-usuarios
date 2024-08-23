import { IsString, IsEmail, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserCmd{
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  age?: number;
}