import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  //Método responsável por fazer o hash de um texto (senha, número, etc...)
  async generateHash(data: string) {
    //O método hash espera o texto para ser feito o hash (1 param) e o salt(Força do Hash - 2 param).
    const hasedData = await bcrypt.hash(data, await bcrypt.genSalt());

    //Retornando o dado hasheado
    return hasedData;
  }

  //Método responsável por comprar o texto enviado pelo usuário e o texto hashado no banco e validar se são iguais
  async compareHash(data: string, encryptedData: string) {
    //O método compare espera um texto enviado pelo usuário (1 param) e o texto hashado no banco (Como tá salvo no banco - 2 param)
    const comparedHash = await bcrypt.compare(data, encryptedData);

    //Caso essa comparação seja inválida lança um exceção
    if (!comparedHash) {
      throw new UnauthorizedException('Dados enviados incorretos.');
    }

    //Retorna o true
    return true;
  }
}
