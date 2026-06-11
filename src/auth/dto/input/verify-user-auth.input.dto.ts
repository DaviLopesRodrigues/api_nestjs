import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class VerifyUserAuthInputDTO {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEmail()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
