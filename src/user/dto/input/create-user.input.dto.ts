import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserInputDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;
}
