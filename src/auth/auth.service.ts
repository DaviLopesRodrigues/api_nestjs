import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthInputDTO } from './dto/input/login-auth.input.dto';
import { ForgetAuthInputDTO } from './dto/input/forget-auth.input.dto';
import { ResetAuthInputDTO } from './dto/input/reset-auth.input.dto';
import { RegisterAuthInputDTO } from './dto/input/register-auth.input.dto';
import { VerifyUserAuthInputDTO } from './dto/input/verify-user-auth.input.dto';
import { CreateTokenJwtAuthInputDTO } from './dto/input/create-token-jwt-auth.input.dto';
import { CryptoService } from '@/crypto/crypto.service';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly mailService: MailService,
  ) {}

  //Método responsável por criar um token JWT
  createTokenJwt(data: CreateTokenJwtAuthInputDTO) {
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
  checkTokenJwt(token: string) {
    try {
      const data = this.jwtService.verify(token);

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //A ideia desse método é retornar uma coisa mais simples (boolean), pode ser útil em alguns momentos.
  isValidToken(token: string) {
    try {
      this.checkTokenJwt(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  //Método responsável por fazer login de usuário
  async login(data: LoginAuthInputDTO) {
    const { email, password } = data;

    const user = await this.verifyUser({ email });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    //Chamando o método para verificar se a senha enviada no login e a senha salva no banco estão batendo
    await this.cryptoService.compareHash(password, user.password);

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
    try {
      const { email } = data;

      const user = await this.verifyUser({ email });

      if (!user) {
        throw new UnauthorizedException('E-mail incorreto.');
      }

      //Se po usuário existir (for válido) crio um token JWT com as informações dele
      const token = this.createTokenJwt({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      //Passo as propriedades necessárias para o envio do email no método
      await this.mailService.sendEmail(
        user.email,
        'Recuperação de Senha',
        'forget-password-template',
        { name: user.name, token: token.accessToken },
      );

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
    throw new InternalServerErrorException(
      'Ocorreu um erro ao processar a recuperação de senha.',
    );
  }

  //Método responsável pela redefinição de senha
  async resetPassword(data: ResetAuthInputDTO) {
    //Recebo a nova senha e o token enviado no email para alterar senha de um usuário

    const user = await this.checkTokenJwt(data.token);

    if (!user) {
      throw new BadRequestException('Token inválido.');
    }

    data.password = await this.cryptoService.generateHash(data.password);

    const userUpdated = await this.userService.updatePartial(user.id, {
      password: data.password,
    });

    //Ao fazer o reset da senha o usuário recebe um JWT
    return this.createTokenJwt({
      id: userUpdated.id,
      email: userUpdated.email,
      name: userUpdated.name,
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
