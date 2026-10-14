import { TestBed } from '@angular/core/testing';
import { Interacao } from '../services/interacao';
import { Experiencias } from '../services/experiencias';
import { Playlist } from '../services/playlist';
import { criarFestasMock } from '../services/festas.mock';
import { lerMusicas, salvarMusicas } from './armazenamento';

describe('Compatibilidade dos dados salvos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('carrega amigos, comentários, respostas e convites antigos como listas', () => {
    localStorage.setItem(
      'festou-amigos-festas',
      JSON.stringify({ 80: ['Ana', 'João'], 81: ['Pedro'] }),
    );
    localStorage.setItem(
      'festou-comentarios',
      JSON.stringify({ 80: [{ pessoa: 'Ana', texto: 'Vamos!' }] }),
    );
    localStorage.setItem('festou-respostas', JSON.stringify({ 80: 'aprovado', 81: 'recusado' }));
    localStorage.setItem(
      'festou-convites',
      JSON.stringify({ 80: [{ pessoa: 'Lívia', status: 'confirmado' }] }),
    );

    const interacao = TestBed.inject(Interacao);
    expect(interacao.amigosNaFesta(80)).toEqual(['Ana', 'João', 'Lívia']);
    expect(interacao.amigosNaFesta(81)).toEqual(['Pedro']);
    expect(interacao.comentariosDaFesta(80)[0].texto).toBe('Vamos!');
    expect(interacao.respostaDaFesta(80)).toBe('aprovado');
    expect(interacao.convitesDaFesta(80)[0].festaId).toBe(80);
    expect(interacao.convitesDaFesta(99)).toEqual([]);

    interacao.adicionarAmigo(80, 'Caio');
    interacao.comentar(80, 'Até lá');
    interacao.pedirParticipacao(82);
    expect(JSON.parse(localStorage.getItem('festou-amigos-festas')!)).toEqual({
      80: ['Ana', 'João', 'Caio'],
      81: ['Pedro'],
    });
    expect(JSON.parse(localStorage.getItem('festou-comentarios')!)[80]).toEqual([
      { pessoa: 'Ana', texto: 'Vamos!' },
      { pessoa: 'Você', texto: 'Até lá' },
    ]);
    expect(JSON.parse(localStorage.getItem('festou-respostas')!)).toEqual({
      80: 'aprovado',
      81: 'recusado',
      82: 'pendente',
    });
  });

  it('responde ao convite sem alterar outra festa nem mudar o formato gravado', () => {
    localStorage.setItem(
      'festou-convites',
      JSON.stringify({
        80: [{ pessoa: 'Ana', status: 'pendente' }],
        81: [{ pessoa: 'Ana', status: 'recusado' }],
      }),
    );
    const festa = { ...criarFestasMock()[0], id: 80, data: '2099-01-01' };
    TestBed.inject(Interacao).responderConvite(festa, 'Ana', true);
    expect(JSON.parse(localStorage.getItem('festou-convites')!)).toEqual({
      80: [{ pessoa: 'Ana', status: 'confirmado' }],
      81: [{ pessoa: 'Ana', status: 'recusado' }],
    });
  });

  it('preserva músicas duplicadas, votos e músicas de outras festas', () => {
    const musica = { nome: 'Mesma música', artista: 'Artista', link: '', votos: ['Ana'] };
    localStorage.setItem('festou-playlist', JSON.stringify({ 80: [musica, musica], 81: [musica] }));
    const playlist = new Playlist();
    playlist.remover(80, 0);
    expect(playlist.daFesta(80)).toHaveLength(1);
    expect(playlist.daFesta(81)).toHaveLength(1);
    playlist.votar(80, 0, 'João');
    const recarregada = new Playlist();
    expect(recarregada.daFesta(80)[0].votos).toEqual(['Ana', 'João']);
    expect(recarregada.daFesta(81)[0].votos).toEqual(['Ana']);
    expect(JSON.parse(localStorage.getItem('festou-playlist')!)[80][0].festaId).toBeUndefined();
  });

  it('atualiza a avaliação somente da pessoa e da festa selecionadas', () => {
    const avaliacao = { pessoa: 'Ana', nota: 3, comentario: 'Boa' };
    localStorage.setItem('festou-avaliacoes', JSON.stringify({ 80: [avaliacao], 81: [avaliacao] }));
    localStorage.setItem('festou-amigos-festas', JSON.stringify({ 80: ['Ana'] }));
    const experiencias = TestBed.inject(Experiencias);
    experiencias.avaliar(
      { ...criarFestasMock()[0], id: 80, status: 'encerrada' },
      'Ana',
      5,
      'Muito boa',
    );
    expect(experiencias.media(80)).toBe('5.0');
    expect(experiencias.media(81)).toBe('3.0');
    expect(JSON.parse(localStorage.getItem('festou-avaliacoes')!)).toEqual({
      80: [{ pessoa: 'Ana', nota: 5, comentario: 'Muito boa' }],
      81: [avaliacao],
    });
  });

  it('grava e recarrega uma lista vazia sem recriar músicas removidas', () => {
    salvarMusicas([]);
    expect(lerMusicas()).toEqual([]);
  });
});
