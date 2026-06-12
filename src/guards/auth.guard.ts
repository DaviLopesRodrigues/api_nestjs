import { AuthService } from '@/auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();

      const { authorization } = request.headers;

      const token = (authorization ?? '').split(' ')[1];

      const data = this.authService.checkTokenJwt(token);

      request.payload = data;

      return true;
    } catch (error) {
      return false;
    }
  }
}
