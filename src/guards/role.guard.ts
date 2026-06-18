import { ROLES_KEY } from '@/decorators/roles.decorator';
import { Role } from '@/enums/role.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      //getAllAndOverride responsável por acessar os métodos e decoratos no Controller
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const { user } = context.switchToHttp().getRequest();

      //Verifica se o usuário tem as/a role/roles que estão/tá settadas em cima do método chamado na request(controller)
      const rolesFiltered = requiredRoles.filter((role) => role === user.role);

      //Se o usuário tiver (array será maior que 0) retorna 'true', caso contrário retorna 'false'
      return rolesFiltered.length > 0;
    } catch (error) {
      return false;
    }
  }
}
