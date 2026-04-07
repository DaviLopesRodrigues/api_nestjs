import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//Decorators são funções que servem para modificar, manipular ou personalizar classes, funçães e etc..
//São identificados pelo uso do @ (@Module) e por vir antes do alvo (nesse caso a classe AppModule)
//O NestJS por padrão tem vários, mas é possível criar personalizados
// Outro ponto interessante é que é possível adicionar vários decorators acima do alvo
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
//Obs -> Os decorators são utilizados em toda arquitetura do Nest (services, controllers, modules, etc)
