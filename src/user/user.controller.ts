import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserInputDTO } from './dto/input/create-user.input.dto';
import {
  UpdatePatchUserInputDTO,
  UpdatePutUserInputDTO,
} from './dto/input/update-user.input.dto';

//Controller users

@Controller('users')
export class UserController {
  //Post - Criação de usuário no banco
  @Post()
  //Body -> Recuperação do corpo da requisição (vindo em JSON)
  // Utilizando o DTO CreateUserInputDTO passando como "tipo" para o parâmetro body
  create(@Body() body: CreateUserInputDTO) {
    //Desestruturando objeto e pegando as props definidas no DTO
    const { name, email, password } = body;
    return { name, email, password };
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
  //ParseIntPipe -> Transformer Pipe responsável por converter o parâmetro recebido para o tipo Int
  findOne(@Param('id', ParseIntPipe) id: number) {
    return { user: {}, id };
  }

  //Get - Listagem de usuários do banco
  @Get()
  //Query -> Recuperação da query enviada na URL da requisição (filtro, paginação, ordenação)
  findStatus(@Query('status') status: string) {
    return { users: [] };
  }

  //Put -> Atualização de usuário no banco
  // Obs -> O '/:id' que será necessário informar na requisição é o id do usuário pesquisado
  @Put(':id')
  //Body -> Recuperação do corpo da requisição (vindo em JSON)
  //Param -> Recuperação do paramâmetro enviado na URL da requisição (identificar recurso específico)
  //Utilizando o DTO UpdatePutUserInputDTO passando como "tipo" para o parâmetro body
  //ParseIntPipe -> Transformer Pipe responsável por converter o parâmetro recebido para o tipo Int
  update(
    @Body() body: UpdatePutUserInputDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    //Desestruturando objeto e pegando as props definidas no DTO
    const { name, email, password } = body;
    return {
      body: {
        name,
        email,
        password,
      },
      param: id,
    };
  }

  //Patch -> Atualização parcial de usuário no banco
  // Obs -> O '/:id' que será necessário informar na requisição é o id do usuário pesquisado
  @Patch(':id')
  //Body -> Recuperação do corpo da requisição (vindo em JSON)
  //Param -> Recuperação do paramâmetro enviado na URL da requisição (identificar recurso específico)
  //Utilizando o DTO UpdatePatchUserInputDTO passando como "tipo" para o parâmetro body
  //ParseIntPipe -> Transformer Pipe responsável por converter o parâmetro recebido para o tipo Int
  updatePartial(
    @Body() body: UpdatePatchUserInputDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    //Desestruturando objeto e pegando as props definidas no DTO
    const { name, email, password } = body;
    return {
      body: {
        name,
        email,
        password,
      },
      param: id,
    };
  }

  //Delete -> Deletar usuário do banco
  // Obs -> O '/:id' que será necessário informar na requisição é o id do usuário pesquisado
  @Delete(':id')
  //Param -> Recuperação do paramâmetro enviado na URL da requisição (identificar recurso específico)
  //ParseIntPipe -> Transformer Pipe responsável por converter o parâmetro recebido para o tipo Int
  delete(@Param('id', ParseIntPipe) id: number) {
    return { id: id };
  }
}
