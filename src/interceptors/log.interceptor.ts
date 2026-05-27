import { LogService } from '@/log/log.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

//LogInterceptor é um Interceptor personalizado para criação de logs
@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //Recupero a requisição
    const request = context.switchToHttp().getRequest();

    //Desestruturo o objeto request para pegar somente as informações que serão salvas no meu banco (método: GET, POST... / url: /users, /users/3...)
    const { method, url } = request;

    return next.handle().pipe(
      tap(async () => {
        //Chamo meu método create para salvar um log no meu banco de dados (tabela tb_logs)
        await this.logService.create({
          method: method,
          url: url,
        });
      }),
    );
  }
}
