import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateLogInputDTO } from './dto/input/create-log.input.dto';

//Service criado para criação de logs
@Injectable()
export class LogService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateLogInputDTO) {
    return this.prismaService.log.create({
      data: data,
    });
  }
}
