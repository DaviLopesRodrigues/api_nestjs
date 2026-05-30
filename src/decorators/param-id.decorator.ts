import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ParamId = createParamDecorator((_data: unknown, context: ExecutionContext) => {

    //Recupero a request do contexto
    const request = context.switchToHttp().getRequest()

    //Desestruturo o objeto request para pegar a prop param
    const {params} = request

    //Faço a conversão do id para número
    const convertedParamToNumber = Number(params.id);

    //Retorno o id convertido (String -> Number)
    return convertedParamToNumber;

}) 