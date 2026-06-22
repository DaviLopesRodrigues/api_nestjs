import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInputDTO } from './dto/input/create-user.input.dto';
import { PrismaService } from '@/prisma/prisma.service';
import {
  UpdatePatchUserInputDTO,
  UpdatePutUserInputDTO,
} from './dto/input/update-user.input.dto';
import { CryptoService } from '@/crypto/crypto.service';

//O service é responsável por se conectar com Banco de Dados e realizar as operações
@Injectable()
export class UserService {
  //Chamando o PrismaService (responsável por se conectar com o Banco)
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  //Método responsável por criar um usuário
  async create(data: CreateUserInputDTO) {
    //Fazendo o Hash da senha no momento que o usuário é criado
    data.password = await this.cryptoService.generateHash(data.password);

    const user = await this.prismaService.user.create({
      data,
    });

    return user;
  }

  //Método responsável por listar todos usuários.
  async findAll() {
    return this.prismaService.user.findMany();
  }

  //Método responsável por listar único usuário.
  async findOne(id: number) {
    await this.userExists(id);

    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  //Método responsável por alterar todas informações de um usuário
  async update(id: number, data: UpdatePutUserInputDTO) {
    await this.userExists(id);

    //Fazendo o Hash da senha no momento que o usuário é criado
    data.password = await this.cryptoService.generateHash(data.password);

    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        //Como a prop birthdate é opcional, quando não vier será salva como null no banco (boa prática)
        birthdate: data.birthdate ? data.birthdate : null,
        role: data.role,
      },
    });
  }

  //Método responsável por alterar informações específicas de um usuário
  async updatePartial(id: number, data: UpdatePatchUserInputDTO) {
    await this.userExists(id);

    //Se usuário quiser trocar a propriedade password e mandar na requisição
    if (data.password) {
      //Faz o Hash da senha no momento que o usuário é criado
      data.password = await this.cryptoService.generateHash(data.password);
    }

    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data,
    });
  }

  //Método responsável por deletar um usuário
  async delete(id: number) {
    await this.userExists(id);

    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  //Método criado para verificar se o usuário enviado na operação existe no banco
  async userExists(id: number) {
    //Método para verificar quantas vezes o id do usuário se repete no banco (em teoria é só uma vez), se for 0 (falso em boolean), cai no if
    // O count é mais rápido pois usa uma tabela de cash que sabe quantos registros existem
    const user = await this.prismaService.user.count({
      where: {
        id,
      },
    });

    //Verificar se o usuário existe antes de atualizar (caso o usuário passado não exista, ocorre um erro de operação no banco)
    if (!user) {
      throw new NotFoundException(`Usuário ${id} não existe.`);
    }
  }
}
