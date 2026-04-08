import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//O Module (app.module.ts) é um conceito do Nest que consistem em separar a aplicação em pequenos módulos
//Resumidamente é como se fosse um agrupador de recursos (geralmente controllers e services)
//É possivel importar módulos de terceiros (imports: []) e exportar módulos para a outros módulos da aplicação (exports: [])
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
