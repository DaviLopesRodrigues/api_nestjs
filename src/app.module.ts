import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [PrismaModule, UserModule, LogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
