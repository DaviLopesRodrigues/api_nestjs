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
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: CreateUserInputDTO) {
    return this.userService.create(body);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
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
    return this.userService.update(id, body);
  }

  @Patch(':id')
  updatePartial(
    @Body() body: UpdatePatchUserInputDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updatePartial(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return { id: id };
  }
}
