import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatus } from './interface/desafio-status.enum';
import { Desafio } from './interface/desafio.interface';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    private readonly jogadorService: JogadoresService,
    private readonly categoriaService: CategoriasService,
  ) {}

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const { solicitante, jogadores } = criarDesafioDto;
    await this.jogadorService.consultarJogadorPorId(jogadores[0]._id);
    await this.jogadorService.consultarJogadorPorId(jogadores[1]._id);

    const JogadorEncontradoFazParteDesafio = jogadores.find(
      (jogador) => solicitante._id === jogador._id,
    );

    if (!JogadorEncontradoFazParteDesafio) {
      throw new BadRequestException(
        `O Solicitante ${solicitante._id} não faz parte do desafio`,
      );
    }

    const categorias = await this.categoriaService.consultarTodasCategorias();
    const CategoriaJogadorSolicitante = categorias.find(
      (categoria) =>
        categoria.jogadores.filter((jogador) => jogador._id == solicitante._id)
          .length > 0,
    );

    if (!CategoriaJogadorSolicitante) {
      throw new NotFoundException(
        `O solicitante ${solicitante._id} não está associado a nenhuma categoria`,
      );
    }

    return await this.desafioModel.create({
      ...criarDesafioDto,
      categoria: CategoriaJogadorSolicitante.categoria,
      dataHoraDesafio: new Date().toISOString(),
      status: DesafioStatus.PENDENTE,
    });
  }

  async consultarTodosDesafios(): Promise<Array<Desafio>> {
    return await this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  async consultarDesafiosDeUmJogador(idJogador: any): Promise<Array<Desafio>> {
    await this.jogadorService.consultarJogadorPorId(idJogador);

    return await this.desafioModel
      .find()
      .where('jogadores')
      .in(idJogador)
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }
}
