import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/adapters/pug.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'), //Esse host é chamado "Ethereal" e serve para simular um servidor de email
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get<string>('MAIL_USER'), //Trocar credenciais ao atualizar página no Ethereal
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"Não responda." <${configService.get<string>('MAIL_USER')}>`,
        },
        template: {
          dir: __dirname + '/templates', //Onde tá o arquivo .pug com o template de email
          adapter: new PugAdapter(),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
