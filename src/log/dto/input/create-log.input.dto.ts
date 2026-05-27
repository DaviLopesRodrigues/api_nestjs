import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLogInputDTO {

  @IsString()
  method: string;

  @IsString()
  url: string;
}
