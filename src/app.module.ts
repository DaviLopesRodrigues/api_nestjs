import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';


//Importação do módulo criado no app.module que é responsável por carregar todos os módulos da aplicação
@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
