import { IsOptional, IsString, IsArray, ArrayMinSize } from 'class-validator';
import { Evento } from '../interface/categoria.interface';

export class AtualizarCategoriaDto {
  @IsString()
  @IsOptional()
  descricao: string;

  @IsArray()
  @ArrayMinSize(1)
  eventos: Array<Evento>;
}
