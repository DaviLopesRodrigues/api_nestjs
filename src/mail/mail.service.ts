import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: { name: string; token: string },
  ) {
    try {
      await this.mailerService.sendMail({
        to, // Destinatário
        subject, // Assunto
        template, // Nome do arquivo sem a extensão (ex: 'forget-password')
        context, // Variáveis definidas no arquivo .pug de template (ex: { name: 'João', code: '123456' })
      });

      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao enviar o e-mail. Tente novamente mais tarde.',
      );
    }
  }
}
