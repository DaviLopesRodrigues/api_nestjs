import { Role } from '@/enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

//Função responsável por armazenar no objeto SerMetadata as roles definidas acima das rotas
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);