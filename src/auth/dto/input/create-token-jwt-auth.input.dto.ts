import { IsEmail, IsNumber, IsString } from 'class-validator';
export class CreateTokenJwtAuthInputDTO {
  @IsNumber()
  id: number;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
