import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (prop: string, context: ExecutionContext) => {
    //Recupero a request do contexto
    const request = context.switchToHttp().getRequest();

    //Desestruturo o objeto request para pegar a prop user criada no auth guard
    const { user } = request;

    //Se caso nenhum usuário vier no objeto request, muito provavelmente o AuthGuard não tá por cima do método no Controller.
    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado na Request. Usar AuthGuard sobre o Controller para obter usuário.',
      );
    }

    //Se caso o usuário quiser alguma propriedade específica do objeto request, pode adicionar dentro do decorator User (ex:. @User('email'))
    if (prop) {
      return request.user[prop];
    }

    //Retorno as informações do usuário
    return user;
  },
);
