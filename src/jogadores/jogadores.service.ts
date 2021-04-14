import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJagadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJagadorDto;
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new BadRequestException(`Jogador com email ${email} já cadastrado`);
    }
    const jogadorCriado = new this.jogadorModel(criarJagadorDto);
    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    await this.verificarSeJogadorExiste(_id);

    await this.jogadorModel
      .findOneAndUpdate(
        {
          _id,
        },
        {
          $set: atualizarJogadorDto,
        },
      )
      .exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPorId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.verificarSeJogadorExiste(_id);
    return jogadorEncontrado;
  }

  async deletarJogador(_id: string): Promise<any> {
    await this.verificarSeJogadorExiste(_id);
    return await this.jogadorModel.deleteOne({ _id }).exec();
  }

  private async verificarSeJogadorExiste(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado.`);
    }

    return jogadorEncontrado;
  }
}
