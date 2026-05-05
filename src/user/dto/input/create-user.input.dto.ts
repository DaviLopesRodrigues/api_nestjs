import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

//O DTO é representado por uma class que agrupa propriedades
export class CreateUserInputDTO {
   //Decorator da lib class-validator para especificar que a prop deve ser string 
  @IsString()
  name: string;

  //Decorator da lib class-validator para especificar que a prop deve ser email (conter @, por exemplo) 
  @IsEmail()
  email: string;

  //Decorator da lib class-validator para especificar que a prop deve ser uma senha e define um padrão para segurança 
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;
}
