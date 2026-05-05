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

@Controller('users')
export class UserController {
  @Post()
  create(@Body() body: CreateUserInputDTO) {
    const { name, email, password } = body;
    return { name, email, password };
  }

  @Get()
  findAll() {
    return { users: [] };
  }

  @Get(':id')

  findOne(@Param('id', ParseIntPipe) id: number) {
    return { user: {}, id };
  }

  @Get()
  findStatus(@Query('status') status: string) {
    return { users: [] };
  }

  @Put(':id')
  update(
    @Body() body: UpdatePutUserInputDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
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

  @Patch(':id')
  updatePartial(
    @Body() body: UpdatePatchUserInputDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
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

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return { id: id };
  }
}
