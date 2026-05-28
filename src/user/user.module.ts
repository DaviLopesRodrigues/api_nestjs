import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { LogModule } from '@/log/log.module';
import { UserIdCheckMiddleware } from '@/middlewares/user-id-check.middleware';

@Module({
  //Importação do PrismaModule que exposta o PrismaService (é necessário pois uso no UserService)
  imports: [PrismaModule, LogModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})

//Configuração do Middleware para ser utilizado no  UserModule
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //Aplicando o UserIdCheckMiddleware no UserModule somente para as rotas que pedem o id no path
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL,
    });
  }
}
