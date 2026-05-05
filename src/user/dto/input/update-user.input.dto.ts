import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

//DTO específico para Atualizar um user com o método PUT
export class UpdatePutUserInputDTO {
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

//DTO específico para Atualizar um user com o método POST
//Obs -> Poderia também usar o PartialType, pegando as props do DTO UpdatePutUserInputDTO e deixando opcionais (não gosto muito pois tem que instalar a lib mapped-types)
export class UpdatePatchUserInputDTO {
  //Decorator da lib class-validator para especificar que a prop deve ser opcional ou string
  @IsOptional()
  @IsString()
  name?: string;

  //Decorator da lib class-validator para especificar que a prop deve ser opcional ou email (conter @, por exemplo)
  @IsOptional()
  @IsEmail()
  email?: string;

  //Decorator da lib class-validator para especificar que a prop deve ser opcional ou uma senha e define um padrão para segurança
  @IsOptional()
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
  })
  password?: string;
}
