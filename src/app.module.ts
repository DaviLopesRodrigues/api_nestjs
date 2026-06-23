import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LogModule } from './log/log.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        //Essa configuração faz com que a API só receba 10 requisições por endpoint a cada 1 minuto (depois disso o servidor emite uma exception)
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }), //Configuração do ConfigModule na aplicação
    PrismaModule,
    UserModule,
    LogModule,
    AuthModule,
    CryptoModule,
  ],
  controllers: [],
  //Definindo o Throttler de forma global na API (mas é possível adicionar de forma local, por cima do controller todo ou endpoint específico)
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
