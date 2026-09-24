import { beforeEach, describe } from '@jest/globals';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { expect, jest, test } from '@jest/globals';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { LoginAuthInputDTO } from './dto/input/login-auth.input.dto';
import { RegisterAuthInputDTO } from './dto/input/register-auth.input.dto';
import { ForgetAuthInputDTO } from './dto/input/forget-auth.input.dto';
import { ResetAuthInputDTO } from './dto/input/reset-auth.input.dto';

const accessToken: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6IkRhdmkgTG9wZXMiLCJlbWFpbCI6ImRhdmlsb3Blc0BlbWFpbC5jb20iLCJpYXQiOjE3ODI1MTIyNTQsImV4cCI6MTc4MzExNzA1NCwic3ViIjoiNCJ9.b68-h9Ht1o3Vs0gS_4nst8t8Q4YCLYlG_GxQC0ug0Wk';

const payload = {
  id: 1,
  name: 'Davi Lopes',
  email: 'davilopes@email.com',
  iat: 1786063342,
  exp: 1786668142,
  sub: '4',
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createTokenJwt: jest.fn().mockReturnValue({accessToken}),
            checkTokenJwt: jest.fn().mockReturnValue(payload),
            isValidToken: jest.fn().mockReturnValue(true),
            login: jest.fn().mockReturnValue({accessToken}),
            register: jest.fn().mockReturnValue({accessToken}),
            forgetPassword: jest.fn().mockReturnValue(true),
            resetPassword: jest.fn().mockReturnValue({accessToken}),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  test('Validação de Definição - AuthController', () => {
    expect(authController).toBeDefined();
  });

  describe('Aplicação dos Guards - AuthController', () => {
    test('Verificação de Aplicação dos Guards', () => {
      //O Reflect permite "espelhar" o código que foi desenvolvido em algum controller, service, etc
      //Nesse contexto, quero pegar os guard que está sobre o método me no AuthController (somente nesse método uso o guard)
      const guards = Reflect.getMetadata(
        '__guards__',
        AuthController.prototype.me,
      );
      console.log(guards);

      //A const guards vai retornar um array (contendo os guards que estão sob o controller)
      expect(guards.length).toEqual(1);

      //Verifico se a instância do 1 guard é a AuthGuard
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
    });
  });

  describe('Authentication', () => {
    test('Method Login', async () => {
      const data: LoginAuthInputDTO = {
        email: 'davi@email.com',
        password:
          '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
      };

      const result = await authController.login(data);

      expect(result).toEqual({ accessToken });
    });

    test('Method Register', async () => {
      const data: RegisterAuthInputDTO = {
        name: 'Davi Lopes',
        email: 'davi@email.com',
        password:
          '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
        birthdate: new Date('2003-08-06').toDateString(),
      };

      const result = await authController.register(data);

      expect(result).toEqual({ accessToken });
    });

    test('Method Forget Password', async () => {
      const data: ForgetAuthInputDTO = {
        email: 'davi@email.com',
      };

      const result = await authController.forgetPassword(data);

      expect(result).toEqual(true);
    });

    test('Method Reset Password', async () => {
      const data: ResetAuthInputDTO = {
        password:
          '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6IkRhdmkgTG9wZXMiLCJlbWFpbCI6ImRhdmlsb3Blc0BlbWFpbC5jb20iLCJpYXQiOjE3ODI1MTIyNTQsImV4cCI6MTc4MzExNzA1NCwic3ViIjoiNCJ9.b68-h9Ht1o3Vs0gS_4nst8t8Q4YCLYlG_GxQC0ug0Wk',
      };

      const result = await authController.resetPassword(data);

      expect(result).toEqual({ accessToken });
    });
  });
});
