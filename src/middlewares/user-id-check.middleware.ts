import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserIdCheckMiddleware implements NestMiddleware {
  //A tipagem Request, Response e NextFunction é do express
  use(request: Request, response: Response, next: NextFunction) {
    const idNumber = Number(request.params.id);
    const idIsNan = isNaN(idNumber);

    //Verificação se o id é Not a Number ou menor igual a 0, caso true, cai no if e nem bate na rota
    //Nesse caso o middleware é bom pois caso caia no if, a requisição nem bate na rota (requisição interceptada antes do manipulador de rota).
    if (idIsNan || idNumber <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    next();
  }
}
