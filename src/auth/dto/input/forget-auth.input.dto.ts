import { IsEmail } from 'class-validator';

export class ForgetAuthInputDTO {
  @IsEmail()
  email: string;
}
