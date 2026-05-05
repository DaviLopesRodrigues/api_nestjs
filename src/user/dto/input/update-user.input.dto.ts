import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdatePutUserInputDTO {
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

export class UpdatePatchUserInputDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
  })
  password?: string;
}
