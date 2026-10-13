import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Festa } from '../models/festa';
import { Interacao } from './interacao';
import { Experiencias } from './experiencias';
import { Playlist } from './playlist';
import { FestaService } from './festa.service';
import { Vitrine } from '../pages/vitrine/vitrine';
import { Agenda } from '../pages/agenda/agenda';
import { RecursosFesta } from '../componentes/recursos-festa/recursos-festa';

describe('Pacote social da Festou', () => {
  const festa: Festa = {
    id: 900,
    nome: 'Eletrônica no Centro',
    local: 'Centro',
    cidade: 'Blumenau',
    latitude: -26,
    longitude: -49,
    data: '2099-01-01',
    horario: '21:00',
    categoria: 'Eletrônica',
    preco: 30,
    pessoasConfirmadas: 0,
    tipo: 'publica',
    limiteParticipantes: 1,
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('calcula os quatro status, respeitando data e capacidade', () => {
    const interacao = TestBed.inject(Interacao);
    expect(interacao.status(festa)).toBe('publicada');
    expect(interacao.status({ ...festa, pessoasConfirmadas: 1 })).toBe('esgotada');
    expect(interacao.status({ ...festa, status: 'cancelada' })).toBe('cancelada');
    expect(interacao.status({ ...festa, data: '2000-01-01' })).toBe('encerrada');
    expect(interacao.status({ ...festa, status: 'encerrada' })).toBe('encerrada');
  });

  it('convite público confirma o amigo uma única vez e ocupa uma vaga', () => {
    const interacao = TestBed.inject(Interacao);
    interacao.convidar(festa, 'Ana');
    interacao.convidar(festa, 'Ana');
    expect(interacao.convites()[festa.id].length).toBe(1);
    interacao.responderConvite(festa, 'Ana', true);
    interacao.responderConvite(festa, 'Ana', true);
    expect(interacao.total(festa)).toBe(1);
    expect(interacao.amigosNaFesta(festa.id)).toContain('Ana');
    expect(interacao.lotada(festa)).toBe(true);
  });

  it('convite privado só confirma depois da aprovação do organizador', () => {
    const interacao = TestBed.inject(Interacao);
    const privada: Festa = { ...festa, tipo: 'privada' };
    interacao.convidar(privada, 'Ana');
    interacao.responderConvite(privada, 'Ana', true);
    expect(interacao.total(privada)).toBe(0);
    expect(interacao.convites()[festa.id][0].status).toBe('aguardando aprovação');
    interacao.aprovarConvite(privada, 'Ana', true);
    expect(interacao.total(privada)).toBe(1);
    TestBed.resetTestingModule();
    expect(TestBed.inject(Interacao).amigosNaFesta(festa.id)).toContain('Ana');
  });

  it('recusa e bloqueia aceite quando a festa é cancelada ou lotada', () => {
    const interacao = TestBed.inject(Interacao);
    interacao.convidar(festa, 'Ana');
    interacao.responderConvite({ ...festa, status: 'cancelada' }, 'Ana', true);
    interacao.responderConvite({ ...festa, pessoasConfirmadas: 1 }, 'Ana', true);
    expect(interacao.convites()[festa.id][0].status).toBe('pendente');
    interacao.responderConvite(festa, 'Ana', false);
    expect(interacao.convites()[festa.id][0].status).toBe('recusado');
    expect(interacao.total(festa)).toBe(0);
  });

  it('emite apenas um ingresso, reserva vaga e bloqueia check-in duplicado', () => {
    const experiencias = TestBed.inject(Experiencias);
    experiencias.emitir(festa);
    experiencias.emitir(festa);
    expect(experiencias.interacao.total(festa)).toBe(1);
    expect(experiencias.interacao.ingressos().filter((id) => id === festa.id).length).toBe(1);
    experiencias.checkin(festa);
    experiencias.checkin(festa);
    expect(experiencias.checkins()).toEqual([festa.id]);
    TestBed.resetTestingModule();
    expect(TestBed.inject(Experiencias).checkins()).toEqual([festa.id]);
  });

  it('não emite ingresso privado sem aprovação, cancelado ou esgotado', () => {
    const experiencias = TestBed.inject(Experiencias);
    experiencias.emitir({ ...festa, tipo: 'privada' });
    experiencias.emitir({ ...festa, status: 'cancelada' });
    experiencias.emitir({ ...festa, status: 'esgotada' });
    expect(experiencias.interacao.ingressos()).not.toContain(festa.id);
    expect(experiencias.checkin(festa)).toContain('necessário');
  });

  it('avalia somente após a festa e calcula a média sem duplicar autores', () => {
    const experiencias = TestBed.inject(Experiencias);
    experiencias.interacao.confirmar(festa.id);
    experiencias.interacao.adicionarAmigo(festa.id, 'Ana');
    experiencias.avaliar(festa, 'Você', 5, 'Ainda não aconteceu');
    expect(experiencias.avaliacoes()[festa.id]).toBeUndefined();
    const encerrada: Festa = { ...festa, status: 'encerrada' };
    experiencias.avaliar(encerrada, 'Você', 5, 'Ótima');
    experiencias.avaliar(encerrada, 'Ana', 3, 'Boa');
    expect(experiencias.media(festa.id)).toBe('4.0');
    experiencias.avaliar(encerrada, 'Você', 1, 'Atualizei');
    experiencias.avaliar(encerrada, 'Intruso', 5, 'Não participei');
    experiencias.avaliar(encerrada, 'Ana', 6, 'Inválida');
    expect(experiencias.avaliacoes()[festa.id].length).toBe(2);
    expect(experiencias.media(festa.id)).toBe('2.0');
    TestBed.resetTestingModule();
    expect(TestBed.inject(Experiencias).media(festa.id)).toBe('2.0');
  });

  it('vota, retira voto, persiste e não transfere votos ao remover músicas', () => {
    const playlist = new Playlist();
    playlist.adicionar(900, { nome: 'Música A', artista: '', link: '' });
    playlist.adicionar(900, { nome: 'Música B', artista: '', link: '' });
    playlist.votar(900, 0, 'Ana');
    playlist.votar(900, 0, 'Ana');
    expect(playlist.daFesta(900)[0].votos).toEqual([]);
    playlist.votar(900, 1, 'João');
    playlist.remover(900, 0);
    expect(new Playlist().daFesta(900)[0].votos).toEqual(['João']);
    expect(playlist.daFesta(901)).toEqual([]);
  });

  it('combina busca sem acentos, categoria, preço e amigos', () => {
    const componente = TestBed.createComponent(Vitrine).componentInstance;
    componente.festas.set([festa, { ...festa, id: 901, preco: 60 }]);
    componente.interacao.adicionarAmigo(900, 'Ana');
    componente.busca.set('eletronica');
    componente.categoria.set('Eletrônica');
    componente.limitePreco.set('30');
    componente.comAmigos.set(true);
    expect(componente.filtradas().map((item) => item.id)).toEqual([900]);
    componente.busca.set('inexistente');
    expect(componente.filtradas()).toEqual([]);
    componente.limparFiltros();
    expect(componente.filtradas().length).toBe(2);
  });

  it('agenda separa próximas, encerradas e canceladas', () => {
    const componente = TestBed.createComponent(Agenda).componentInstance;
    componente.festas.set([
      festa,
      { ...festa, id: 901, status: 'encerrada' },
      { ...festa, id: 902, status: 'cancelada' },
    ]);
    componente.interacao.confirmadas.set([900, 901, 902]);
    expect(componente.lista().map((item) => item.id)).toEqual([900]);
    componente.aba.set('historico');
    expect(componente.lista().map((item) => item.id)).toEqual([901]);
    componente.aba.set('canceladas');
    expect(componente.lista().map((item) => item.id)).toEqual([902]);
  });

  it('compartilha o id correto e oferece alternativa quando a cópia falha', async () => {
    const fixture = TestBed.createComponent(RecursosFesta);
    fixture.componentRef.setInput('festa', festa);
    const componente = fixture.componentInstance;
    expect(componente.link()).toContain('/festa/900');
    expect(decodeURIComponent(componente.whatsapp())).toContain(festa.nome);
    const copiar = vi.fn().mockRejectedValue(new Error('Negado'));
    vi.stubGlobal('navigator', { clipboard: { writeText: copiar } });
    await componente.copiar();
    expect(componente.mensagem()).toContain('Selecione o link');
    vi.unstubAllGlobals();
  });

  it('persiste o status na festa sem perder os campos anteriores', () => {
    const servico = new FestaService();
    const criada = servico.criarFesta(festa);
    servico.atualizarFesta({ ...criada, status: 'cancelada' });
    const lista = new FestaService().festas();
    {
      expect(lista.find((item) => item.id === criada.id)).toEqual({
        ...criada,
        status: 'cancelada',
      });
    }
  });
});
