import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

//Controller users

@Controller('users')
export class UserController {
  //Post - Criação de usuário no banco
  @Post()
  //Body -> Recuperação do corpo da requisição (vindo em JSON)
  create(@Body() body) {
    return { body };
  }

  //Get - Listagem de usuários do banco
  @Get()
  findAll() {
    return { users: [] };
  }

  //Get - Listagem de usuário do banco
  // Obs -> O '/:id' que será necessário informar na requisição é o id do usuário pesquisado
  @Get(':id')
  //Param -> Recuperação do paramâmetro enviado na URL da requisição (identificar recurso específico)
  findOne(@Param('id') param) {
    return { user: {}, param };
  }

  //Get - Listagem de usuários do banco
  @Get()
  //Query -> Recuperação da query enviada na URL da requisição (filtro, paginação, ordenação)
  findStatus(@Query('status') status) {
    return { users: [] };
  }

  //Put -> Atualização de usuário no banco
  // Obs -> O '/:id' que será necessário informar na requisição é o id do usuário pesquisado
  @Put(':id')
  //Body -> Recuperação do corpo da requisição (vindo em JSON)
  //Param -> Recuperação do paramâmetro enviado na URL da requisição (identificar recurso específico)
  update(@Body() body, @Param('id') param) {
    return { user: {} };
  }

  //Patch -> Atualização parcial de usuário no banco
  // Obs -> O '/:id' que será necessário informar na requisição é o id do usuário pesquisado
  @Patch(':id')
  //Body -> Recuperação do corpo da requisição (vindo em JSON)
  //Param -> Recuperação do paramâmetro enviado na URL da requisição (identificar recurso específico)
  updatePartial(@Body() body, @Param('id') param) {
    return { user: {} };
  }
}
