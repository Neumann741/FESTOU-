import {
  AmigoNaFesta,
  Avaliacao,
  Comentario,
  Convite,
  MusicaDaFesta,
  Resposta,
} from '../models/interacoes';

export function lerDados<T>(chave: string, padrao: T): T {
  const dados = localStorage.getItem(chave);
  if (dados === null) {
    return padrao;
  }
  return JSON.parse(dados);
}

export function salvarDados(chave: string, dados: unknown) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function lerGrupos<T extends { festaId: number }>(
  chave: string,
  padrao: { [id: string]: object[] } = {},
): T[] {
  const grupos = lerDados<{ [id: string]: object[] }>(chave, padrao);
  const lista: T[] = [];
  for (const id of Object.keys(grupos)) {
    for (const item of grupos[id]) {
      lista.push({ ...item, festaId: Number(id) } as T);
    }
  }
  return lista;
}

function salvarGrupos<T extends { festaId: number }>(chave: string, lista: T[]) {
  const grupos: { [id: number]: object[] } = {};
  for (const item of lista) {
    const { festaId, ...dados } = item;
    if (!grupos[festaId]) {
      grupos[festaId] = [];
    }
    grupos[festaId].push(dados);
  }
  salvarDados(chave, grupos);
}

export function lerConvites(): Convite[] {
  return lerGrupos<Convite>('festou-convites');
}

export function salvarConvites(lista: Convite[]) {
  salvarGrupos('festou-convites', lista);
}

export function lerComentarios(): Comentario[] {
  return lerGrupos<Comentario>('festou-comentarios', {
    1: [{ pessoa: 'Ana', texto: 'Eu vou! Vai ser demais.' }],
    2: [{ pessoa: 'João', texto: 'Já chamei toda a galera.' }],
  });
}

export function salvarComentarios(lista: Comentario[]) {
  salvarGrupos('festou-comentarios', lista);
}

export function lerAvaliacoes(): Avaliacao[] {
  return lerGrupos<Avaliacao>('festou-avaliacoes');
}

export function salvarAvaliacoes(lista: Avaliacao[]) {
  salvarGrupos('festou-avaliacoes', lista);
}

export function lerMusicas(): MusicaDaFesta[] {
  return lerGrupos<MusicaDaFesta>('festou-playlist');
}

export function salvarMusicas(lista: MusicaDaFesta[]) {
  salvarGrupos('festou-playlist', lista);
}

export function lerRespostas(): Resposta[] {
  const dados = lerDados<{ [id: string]: string }>('festou-respostas', {});
  const lista: Resposta[] = [];
  for (const id of Object.keys(dados)) {
    lista.push({ festaId: Number(id), status: dados[id] });
  }
  return lista;
}

export function salvarRespostas(lista: Resposta[]) {
  const dados: { [id: number]: string } = {};
  for (const resposta of lista) {
    dados[resposta.festaId] = resposta.status;
  }
  salvarDados('festou-respostas', dados);
}

export function lerAmigos(): AmigoNaFesta[] {
  const dados = lerDados<{ [id: string]: string[] }>('festou-amigos-festas', {
    1: ['Ana', 'João'],
    2: ['Lívia'],
    5: ['Pedro', 'Marina'],
  });
  const lista: AmigoNaFesta[] = [];
  for (const id of Object.keys(dados)) {
    for (const pessoa of dados[id]) {
      lista.push({ festaId: Number(id), pessoa });
    }
  }
  return lista;
}

export function salvarAmigos(lista: AmigoNaFesta[]) {
  const dados: { [id: number]: string[] } = {};
  for (const amigo of lista) {
    if (!dados[amigo.festaId]) {
      dados[amigo.festaId] = [];
    }
    dados[amigo.festaId].push(amigo.pessoa);
  }
  salvarDados('festou-amigos-festas', dados);
}
