import { Injectable } from '@nestjs/common';
import { CreateUserInputDTO } from './dto/input/create-user.input.dto';
import { PrismaService } from '@/prisma/prisma.service';

//O service é responsável por se conectar com Banco de Dados e realizar as operações
@Injectable()
export class UserService {
  //Chamando o PrismaService (responsável por se conectar com o Banco)
  constructor(private readonly prismaService: PrismaService) {}

  //Método responsável por criar um usuário
  async create(data: CreateUserInputDTO) {
    const user = await this.prismaService.user.create({
      data,
    });

    return user;
  }
}
