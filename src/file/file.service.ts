import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {
  //Método responsável por fazer o upload de um avatar (file)
  //Claro que salvei dessa forma para fins de estudo, em produção o correto é usar algum serviço de storage
  async uploadAvater(avatar: Express.Multer.File, userId: string) {
    try {
      const storageDir = join(process.cwd(), 'storage', 'avatar');
      const filePath = join(storageDir, `avatar-${userId}.png`);
      writeFile(filePath, avatar.buffer);

      return { success: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
