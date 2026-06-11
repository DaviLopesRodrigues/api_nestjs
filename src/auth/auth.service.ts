import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { LoginAuthInputDTO } from './dto/input/login-auth.input.dto';
import { ForgetAuthInputDTO } from './dto/input/forget-auth.input.dto';
import { ResetAuthInputDTO } from './dto/input/reset-auth.input.dto';
import { RegisterAuthInputDTO } from './dto/input/register-auth.input.dto';
import { VerifyUserAuthInputDTO } from './dto/input/verify-user-auth.input.dto';
import { CreateTokenJwtAuthInputDTO } from './dto/input/create-token-jwt-auth.input.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  //Método responsável por criar um token JWT
  async createTokenJwt(data: CreateTokenJwtAuthInputDTO) {
    const { id, name, email } = data;
    //Payload composto pelo id, nome e email do usuário
    const token = this.jwtService.sign(
      {
        id: id,
        name: name,
        email: email,
      },
      {
        expiresIn: '7 days',
        subject: String(id),
      },
    );

    return { accessToken: token };
  }

  //Método responsável por validar/ verificar um token JWT
  async checkTokenJwt(token: string) {
    try {
      const data = this.jwtService.verify(token);

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //A ideia desse método é retornar uma coisa mais simples (boolean), pode ser útil em alguns momentos.
  async isValidToken(token: string) {
    try {
      await this.checkTokenJwt(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  //Método responsável por fazer login de usuário
  async login(data: LoginAuthInputDTO) {
    const { email, password } = data;

    const user = await this.verifyUser({ email, password });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    //Ao fazer o login o usuário recebe um JWT
    return this.createTokenJwt({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }

  //Método responsável por criar um usuário
  async register(data: RegisterAuthInputDTO) {
    const { email } = data;
    const user = await this.verifyUser({ email });
    if (user) {
      throw new ConflictException('Erro ao criar conta. Tente novamente.');
    }

    const registerUser = await this.userService.create(data);

    //Ao registrar um usuário o usuário recebe um JWT
    return this.createTokenJwt({
      id: registerUser.id,
      email: registerUser.email,
      name: registerUser.name,
    });
  }

  //Método responsável pela solicitação de redefinição de senha
  async forgetPassword(data: ForgetAuthInputDTO) {
    const { email } = data;

    const user = await this.verifyUser({ email });

    if (!user) {
      throw new UnauthorizedException('E-mail incorreto.');
    }

    //TO DO: Enviar email com código para o usuário

    return true;
  }

  //Método responsável pela redefinição de senha
  async resetPassword(data: ResetAuthInputDTO) {
    const { password, token } = data;

    //TO DO: Validar o token enviado para o usuário

    const id = 0;

    const user = await this.userService.updatePartial(id, { password });

    //Ao fazer o reset da senha o usuário recebe um JWT
    return this.createTokenJwt({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }

  //Método responsável por verificar a situação de um usuário
  private async verifyUser(where: VerifyUserAuthInputDTO) {
    const user = await this.prismaService.user.findFirst({
      where,
    });

    return user;
  }
}
