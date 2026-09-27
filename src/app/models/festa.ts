export interface Festa {
  id: number;
  nome: string;
  descricao?: string;
  latitude: number;
  longitude: number;
  local: string;
  cidade: string;
  /** Data local no formato YYYY-MM-DD. */
  data: string;
  horario: string;
  categoria: string;
  preco?: number;
  imagem?: string;
  pessoasConfirmadas: number;
  tipo: 'publica' | 'privada';
}
