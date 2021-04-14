import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interface/desafio.interface';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    return await this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Get()
  async consultarDesafios(): Promise<Array<Desafio>> {
    return await this.desafiosService.consultarTodosDesafios();
  }

  @Get(':idJogador')
  async consultarDesafiosDeUmJogador(
    @Param('idJogador') idJogador: string,
  ): Promise<Array<Desafio>> {
    return await this.desafiosService.consultarDesafiosDeUmJogador(idJogador);
  }

  @Put(':idJogador')
  async atualizarDesafio(
    @Param('idJogador') idJogaor: string,
    @Body() atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    return await this.desafiosService.atualizarDesafioDto(
      idJogador,
      atualizarDesafioDto,
    );
  }
}
