import { AuthService } from '@/auth/auth.service';
import { UserService } from '@/user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const { authorization } = request.headers;

      const token = (authorization ?? '').split(' ')[1];

      const data = this.authService.checkTokenJwt(token);

      request.payload = data;

      //Pegando as informações do usuário
      const user = await this.userService.findOne(data.id);

      //Criando a propriedade user dentro do objeto request e atribuindo as informações do usuário
      request.user = user;

      return true;
    } catch (error) {
      return false;
    }
  }
}
