import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

//@Controller é um exemplo de decorator que tem como alvo a class AppController
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
