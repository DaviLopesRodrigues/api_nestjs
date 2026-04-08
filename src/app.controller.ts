import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

//O Controller (app.controller.ts) serve para direcionar as requisições recebidas
//Esse direcionamento depende do endpoint (rota) e do método HTTP que o cliente usou
//O Controller é como se fosse um garçom que recebe um pedido, vai até a cozinha e deixa o pedido com o chef (geralmente o service)
//Não é uma boa prática usar o controller para validações, lógicas de negócio, bater no banco, etc...
//Podemos passar uma string dentro do decorator @Controller (@Controller('users')) e todos métodos dentro dele atenderão a partir de "/users"
//É possível também adicionar strings dentro dos decorators de métodos HTTP (@Post(":id")), nesse caso o método Post atenderá por (/users/:id)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
