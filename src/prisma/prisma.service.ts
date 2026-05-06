import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

//Configurei esse service com base na documentação do Nest
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    //Por padrão o Nest pede para usar um adaptador para conexão com o banco
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    super({ adapter });
  }

  //Método responsável por iniciar conexão com o Banco de Dados.
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
