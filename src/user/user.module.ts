import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { LogModule } from '@/log/log.module';

@Module({
  //Importação do PrismaModule que exposta o PrismaService (é necessário pois uso no UserService)
  imports: [PrismaModule, LogModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
