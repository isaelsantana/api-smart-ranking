import { DesafioStatus } from '../interface/desafio-status.enum';

export class AtualizarDesafioDto {
  status: DesafioStatus;
  dataHoraDesafio: Date;
}
