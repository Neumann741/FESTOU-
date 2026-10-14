export interface Comentario {
  festaId: number;
  pessoa: string;
  texto: string;
}

export interface Convite {
  festaId: number;
  pessoa: string;
  status: string;
}

export interface Resposta {
  festaId: number;
  status: string;
}

export interface AmigoNaFesta {
  festaId: number;
  pessoa: string;
}

export interface Avaliacao {
  festaId: number;
  pessoa: string;
  nota: number;
  comentario: string;
}

export interface Musica {
  nome: string;
  artista: string;
  link: string;
  votos?: string[];
}

export interface MusicaDaFesta {
  festaId: number;
  nome: string;
  artista: string;
  link: string;
  votos?: string[];
}
