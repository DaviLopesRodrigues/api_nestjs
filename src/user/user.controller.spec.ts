import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { TestingModule, Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '@prisma/client';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { LogService } from '../log/log.service';
import { FileService } from '../file/file.service';
import { CreateUserInputDTO } from './dto/input/create-user.input.dto';
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

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn<any>().mockResolvedValue(mockUserList[0]),
            findAll: jest.fn<any>().mockResolvedValue(mockUserList),
            findOne: jest.fn<any>().mockResolvedValue(mockUserList[0]),
            update: jest.fn<any>().mockResolvedValue(mockUserList[0]),
            updatePartial: jest.fn<any>().mockResolvedValue(mockUserList[0]),
            delete: jest.fn<any>().mockResolvedValue(mockUserList[0]),
          },
        },
        {
          provide: LogService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: FileService,
          useValue: {
            uploadAvatar: jest.fn(),
          },
        },
      ],
      //O método overrideGuard sobrescreve um guard para fazer com que não seja necessário o guard verificar a requisição (sem necessidade para os casos de teste)
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RoleGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  test('Validação de Definição - UserController', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe("Aplicação dos Guards - UserController", () => {
    test('Verificação de Aplicação dos Guards', () => {
      //O Reflect permite "espelhar" o código que foi desenvolvido em algum controller, service, etc
      //Nesse contexto, quero pegar os guards qye estão no UserController
      const guards = Reflect.getMetadata('__guards__', UserController);

      //A const guards vai retornar um array (contendo os guards que estão sob o controller)
      expect(guards.length).toEqual(2);

      //Verifico se a instância do 1 guard é a AuthGuard
      expect(new guards[0]()).toBeInstanceOf(AuthGuard)

      //Verifico se a instancia 2 segundo guard é a RoleGuad
      expect(new guards[1]()).toBeInstanceOf(RoleGuard)
    })
  })

  describe('Create', () => {
    test('Method Create', async () => {
      const data: CreateUserInputDTO = {
        name: 'Davi Lopes',
        email: 'davi@email.com',
        password:
          '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
        birthdate: '2003-08-06',
        role: Role.ADMIN,
      };

      const result = await userService.create(data);

      expect(result).toEqual(mockUserList[0]);
    });
  });

  describe('Find', () => {
    test('Method Find All', async () => {
      const result = await userService.findAll();

      expect(result).toEqual(mockUserList);
    });

    test('Method Find One', async () => {
      const result = await userService.findOne(1);

      expect(result).toEqual(mockUserList[0]);
    });
  });

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

  describe('Delete', () => {
    test('Method Delete', async () => {
      const result = await userService.delete(1);
      expect(result).toEqual(mockUserList[0]);
    });
  });
});
