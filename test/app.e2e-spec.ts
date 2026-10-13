import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, test, afterAll, beforeAll } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Role } from '../src/enums/role.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //Esse hook faz com que todas conexões com o Banco de testes sejam encerradas. (Antes de colocar tava dando um aviso ao rodar o teste)
  afterAll(async () => {
    await app.close();
  });

  test('Registrar usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Davi Teste',
        email: 'daviteste@email.com',
        password: '123456@@$',
      });

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
  });

  test('Login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'daviteste@email.com',
        password: '123456@@$',
      });

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');

    accessToken = response.body.accessToken;
  });

  test('Obter os dados do usuário logado', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.user.id).toEqual('number');
    expect(response.body.user.role).toEqual(Role.USER);

    accessToken = response.body.accessToken;
  });

  test('Listar usuários', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(403); //Nesse caso o correto és que o retorno seja um erro já que um usuário comum não pode visualizar todos os usuários do sistema
    expect(response.body.error).toEqual('Forbidden');
  });
});
