import 'dotenv/config'; //Necessário adicionar para que seja possível usar envs na aplicação
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://meusite.com.br'], //Origens que podem fazer requisições
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], //Métodos que o navegador permite executar
    allowHeaders: ['Content-Type', 'Authorization'], //Cabeçalhos permitidos na requisição
    credentials: true, //Permissão de envio de cookies e certificados na requisição
    maxAge: 86400, //Tempo que o navegador guarda em cache a resposta do preflight
  });

  app.useGlobalPipes(new ValidationPipe());

  //Fechar conexão com o Banco de Dados após realizar operações
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
