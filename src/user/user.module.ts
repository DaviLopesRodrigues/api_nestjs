import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  //Importação do PrismaModule que exposta o PrismaService (é necessário pois uso no UserService)
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
