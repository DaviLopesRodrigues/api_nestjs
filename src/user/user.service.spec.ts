import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { CreateUserInputDTO } from './dto/input/create-user.input.dto';
import { Role } from '../enums/role.enum';
import { User } from '@prisma/client';
import {
  UpdatePatchUserInputDTO,
  UpdatePutUserInputDTO,
} from './dto/input/update-user.input.dto';

const mockUserList: User[] = [
  {
    id: 1,
    name: 'Davi Lopes',
    email: 'davi@email.com',
    password: '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
    birthdate: new Date('2003-08-06'),
    role: Role.ADMIN,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Paulo José',
    email: 'paulojose@email.com',
    password: '$10$1WSyuWAfro8pLd0ZuI0pQ.NUPWhySeU8s3X7hel9wHqinkmeoc6sq',
    birthdate: new Date('1987-10-06'),
    role: Role.USER,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'Luiz Augusto',
    email: 'luizaugusto@email.com',
    password: '$10$1WSyuWAfro8pLd0ZuI0pQ.NUPWhySeU8s3X7hel9wHqinkmeoc6sq',
    birthdate: new Date('2000-07-04'),
    role: Role.USER,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// O método describe agrupa os vários cenários de teste relacionados ao UserService
describe('UserService', () => {
  // Variável que guardar a instância real do userService
  let userService: UserService;

  // O método beforeEach faz com que o bloco seja executado antes de cada teste rodar (prepara o ambiente para o teste rodar)
  beforeEach(async () => {
    // Criação de módulo simulação do NestJS só para o ambiente de testes
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        //Instância de UserService (classe que será testada)
        UserService,
        //Como UserService injeta PrismaService e CryptoService, é necessário simular a instância deles
        {
          provide: PrismaService,
          useValue: {
            user: {
              //Aqui vem todos os métodos do prisma que uso no UserService (métodos do Prisma são os nativos do ORM  e não os que eu crio na classe UserService)
              create: jest.fn<any>().mockResolvedValue(mockUserList[0]), //Deixo setado o que o método vai retornar (lembrando que é tudo mock)
              findMany: jest.fn<any>().mockResolvedValue(mockUserList), //Deixo setado o que o método vai retornar (lembrando que é tudo mock)
              findUnique: jest.fn<any>().mockResolvedValue(mockUserList[0]), //Deixo setado o que o método vai retornar (lembrando que é tudo mock)
              update: jest.fn<any>().mockResolvedValue(mockUserList[0]), //Deixo setado o que o método vai retornar (lembrando que é tudo mock)
              delete: jest.fn<any>().mockResolvedValue(mockUserList[0]), //Deixo setado o que o método vai retornar (lembrando que é tudo mock)
              count: jest.fn<any>().mockResolvedValue(true), //Mockei como true pois estava dando erro ao testar o findOne (exceção dava que o id do user testado não existia)
            },
          },
        },
        {
          provide: CryptoService,
          useValue: {
            //Os métodos do bcrypt que uso no UserService
            generateHash: jest.fn(),
            compareHash: jest.fn(),
          },
        },
      ],
    }).compile(); // Compila o módulo de teste na memória

    // Busca e atribui a instância criada do UserService na variável
    userService = module.get<UserService>(UserService);
  });

  // Esse teste verifica se o serviço foi instanciado corretamente sem erros de injeção
  test('Validação de Definição - UserService', () => {
    //Espera que a variável userService esteja definida (toBeDefined)
    expect(userService).toBeDefined();
  });

  //O describe vai agrupar todos os testes relacionados ao meu método create (do userService)
  describe('Create', () => {
    test('Method Create', async () => {
      //Crio o DTO de input (o userService.create recebe CreateUserInputDTO)
      const data: CreateUserInputDTO = {
        name: 'Davi Lopes',
        email: 'davi@email.com',
        password:
          '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
        birthdate: '2003-08-06',
        role: Role.ADMIN,
      };

      const result = await userService.create(data);

      //Aqui faço a comparação do retorno do método create com o primeiro objeto do meu array de mock (o retorno tem que bater com que o método create retorna)
      expect(result).toEqual(mockUserList[0]);
    });
  });

  //O describe vai agrupar todos os testes relacionados ao meu métodos find (do userService)
  describe('Find', () => {
    test('Method Find All', async () => {
      const result = await userService.findAll();

      //Como o método findAll retorna uma lista de usuários, comparo o resultado retornado pelo método com o meu array mock (que também é uma lista de usuários)
      expect(result).toEqual(mockUserList);
    });

    test('Method Find One', async () => {
      const result = await userService.findOne(1);
      expect(result).toEqual(mockUserList[0]);
    });
  });

  //O describe vai agrupar todos os testes relacionados ao meu métodos update (do userService)
  describe('Update', () => {
    test('Method Update', async () => {
      const data: UpdatePutUserInputDTO = {
        name: 'Davi Rodrigues',
        email: 'davirodrigues@email.com',
        password:
          '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
        birthdate: '2003-08-06',
        role: Role.ADMIN,
      };
      const result = await userService.update(1, data);

      expect(result).toEqual(mockUserList[0]);
    });

    test('Method Update Partial', async () => {
      const data: UpdatePatchUserInputDTO = {
        birthdate: '2002-08-06',
      };
      const result = await userService.updatePartial(1, data);

      expect(result).toEqual(mockUserList[0]);
    });
  });

  //O describe vai agrupar todos os testes relacionados ao meu métodos delete (do userService)
  describe('Delete', () => {
    test('Method Delete', async () => {
      const result = await userService.delete(1);
      expect(result).toEqual(mockUserList[0]);
    });
  });
});
