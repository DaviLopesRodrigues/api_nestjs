import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { MailService } from '../mail/mail.service';
import { CreateTokenJwtAuthInputDTO } from './dto/input/create-token-jwt-auth.input.dto';
import { LoginAuthInputDTO } from './dto/input/login-auth.input.dto';
import { Role } from '../enums/role.enum';
import { User } from '@prisma/client';
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

const user: User = {
  id: 1,
  name: 'Davi Lopes',
  email: 'davi@email.com',
  password: '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
  birthdate: new Date('2003-08-06'),
  role: Role.ADMIN,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('AuthService ', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn<any>().mockReturnValue(accessToken),
            verify: jest.fn<any>().mockReturnValue(payload),
          },
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn<any>().mockResolvedValue(user),
            updatePartial: jest.fn<any>().mockResolvedValue(user),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn<any>().mockResolvedValue(user),
            },
          },
        },
        {
          provide: CryptoService,
          useValue: {
            generateHash: jest.fn(),
            compareHash: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  test('Validação de Definição - AuthService', () => {
    expect(authService).toBeDefined();
  });

  describe('Token', () => {
    test('Method Create Token', async () => {
      const data: CreateTokenJwtAuthInputDTO = {
        id: 1,
        name: 'Davi Lopes',
        email: 'davi@email.com',
      };
      const result = authService.createTokenJwt(data);

      expect(result).toEqual({
        accessToken,
      });
    });

    test('Method Check Token', async () => {
      const token = accessToken;

      const result = authService.checkTokenJwt(token);

      expect(result).toEqual(payload);
    });

    test('Method Is Valid Token', async () => {
      const token = accessToken;

      const result = authService.isValidToken(token);

      expect(result).toEqual(true);
    });
  });

  describe('Authentication', () => {
    test('Method Login', async () => {
      const data: LoginAuthInputDTO = {
        email: 'davi@email.com',
        password:
          '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
      };

      const result = await authService.login(data);

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

      //Como já mockei o retorno do findFirst com user e nesse caso específico quero que ele retorno null, uso o método spyOn para ficar "espionando" quando o findFirst for chamado nesse contexto para que ele retorne null
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);

      const result = await authService.register(data);

      expect(result).toEqual({ accessToken });
    });

    test('Method Forget Password', async () => {
      const data: ForgetAuthInputDTO = {
        email: 'davi@email.com',
      };

      const result = await authService.forgetPassword(data);

      expect(result).toEqual(true);
    });

    test('Method Reset Password', async () => {
      const data: ResetAuthInputDTO = {
        password:
          '$2b$10$IGF0dDyxUJe0BrZhgg0Z0.OnFwMxsoB6DE67wXLDd6mSP3OH9SDmq',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6IkRhdmkgTG9wZXMiLCJlbWFpbCI6ImRhdmlsb3Blc0BlbWFpbC5jb20iLCJpYXQiOjE3ODI1MTIyNTQsImV4cCI6MTc4MzExNzA1NCwic3ViIjoiNCJ9.b68-h9Ht1o3Vs0gS_4nst8t8Q4YCLYlG_GxQC0ug0Wk',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);

      const result = await authService.resetPassword(data);

      expect(result).toEqual({accessToken});
    });
  });
});
