import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class UpdateUserFilter{

  @IsString()
  readonly name?: string;

  @IsEmail()
  readonly email?: string;


  @IsNumber()
  readonly age?: number;
}