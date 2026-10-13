export interface CadastroFesta {
  nome: string;
  descricao?: string;
  latitude: number;
  longitude: number;
  local: string;
  cidade: string;
  data: string;
  horario: string;
  categoria: string;
  preco?: number;
  imagem?: string;
  pessoasConfirmadas: number;
  tipo: 'publica' | 'privada';
  eventoGrande?: boolean;
  organizadora?: string;
  limiteParticipantes?: number;
  status?: 'publicada' | 'esgotada' | 'cancelada' | 'encerrada';
}
