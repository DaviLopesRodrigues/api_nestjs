import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

//A função bootstrap é responsável por iniciar toda aplicação NestJS
//Dentro da função podemos adicionar conficurações (ex: CORS, Swagger, etc...)
async function bootstrap() {
  //O NestFactory cria uma instância da class AppModule
  const app = await NestFactory.create(AppModule);

  //Ao trabalhar com DTOs, é necessário configurar dessa forma:
  app.useGlobalPipes(new ValidationPipe());

  //A aplicação irá rodar em uma porta definida no .env ou na porta 3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
