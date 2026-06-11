import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthInputDTO } from './dto/input/login-auth.input.dto';
import { RegisterAuthInputDTO } from './dto/input/register-auth.input.dto';
import { ForgetAuthInputDTO } from './dto/input/forget-auth.input.dto';
import { ResetAuthInputDTO } from './dto/input/reset-auth.input.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Método responsável pelo login de um usuário
  @Post('login')
  async login(@Body() body: LoginAuthInputDTO) {
    return this.authService.login(body);
  }

  //Método responsável pelo cadastro de um usuário
  @Post('register')
  async register(@Body() body: RegisterAuthInputDTO) {
    return this.authService.register(body);
  }

  //Método responsável pela solicitação de redefinição de senha
  @Post('forget-password')
  async forgetPassword(@Body() body: ForgetAuthInputDTO) {
    return this.authService.forgetPassword(body);
  }

  //Método responsável pela redefinição de senha
  @Post('reset-password')
  async resetPassword(@Body() body: ResetAuthInputDTO) {
    return this.authService.resetPassword(body);
  }

  @Post('me')
  async me(@Body() body) {
    return this.authService.checkTokenJwt(body.token);
  }
}
