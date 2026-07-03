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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserInputDTO } from './dto/input/create-user.input.dto';
import {
  UpdatePatchUserInputDTO,
  UpdatePutUserInputDTO,
} from './dto/input/update-user.input.dto';
import { UserService } from './user.service';
import { LogInterceptor } from '@/interceptors/log.interceptor';
import { ParamId } from '@/decorators/param-id.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/enums/role.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { RoleGuard } from '@/guards/role.guard';
import { User } from '@/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '@/file/file.service';

@UseGuards(AuthGuard, RoleGuard)
//Decorator responsável por instânciar a classe do interceptor personalizado e capturar os logs quando bater nos endpoints desse controller.
@UseInterceptors(LogInterceptor)
@Roles(Role.ADMIN) //Para bater em qualquer método o usuário tem que ter a role ADMIN
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  create(@Body() body: CreateUserInputDTO) {
    return this.userService.create(body);
  }

  //Como estamos usando o Multer, precisamos chamar o FileInterceptor passando o nome na propriedade enviada no form
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('avatar')
  //O decorator @UploadedFile é o responsável por "capturar" o file enviado na requisição
  uploadAvatar(@User() user, @UploadedFile() avatar: Express.Multer.File) {
    return this.fileService.uploadAvater(avatar, user.id);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@ParamId() id: number) {
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
    return this.userService.delete(id);
  }
}
