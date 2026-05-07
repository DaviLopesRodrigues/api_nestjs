import { IsEmail, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserInputDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
