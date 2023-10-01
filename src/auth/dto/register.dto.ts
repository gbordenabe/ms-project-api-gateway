import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  readonly username: string;

  @IsString()
  password: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;
}
