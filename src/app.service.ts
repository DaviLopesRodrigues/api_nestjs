import { Injectable } from '@nestjs/common';

//O Service (app.service.ts) é o responsável por lidar com toda parte de lógica e regras de negócio, solicitaçòes ao banco, etc...
//Pegando a analogia do restaurante, o service é o chef, o garçom (controller) entrega o pedido pro chef que se encarrega de preparar
// O decorator @Injectable permite que a classe service seja injetada em outras classes (como as de controller)
//Após ser instânciada no constroller, todos os métodos da classe service ficam disponíveis para acesso.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
