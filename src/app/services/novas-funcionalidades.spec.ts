import { TestBed } from '@angular/core/testing';
import { Interacao } from './interacao';
import { Avisos } from './avisos';
import { Usuario } from './usuario';
import { FestaService } from './festa.service';
import { Festa } from '../models/festa';

describe('Funcionalidades locais da Festou', () => {
  const festa: Festa = {
    id: 999,
    nome: 'Festa teste',
    local: 'Centro',
    cidade: 'Blumenau',
    latitude: -26.9,
    longitude: -49.1,
    data: '2027-01-01',
    horario: '20:00',
    categoria: 'Rock',
    tipo: 'privada',
    pessoasConfirmadas: 0,
    limiteParticipantes: 1,
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });
  afterEach(() => localStorage.clear());

  it('envia apenas um pedido e aprova com presença e notificação', () => {
    const interacao = TestBed.inject(Interacao);
    const avisos = TestBed.inject(Avisos);
    interacao.pedirParticipacao(festa.id);
    interacao.pedirParticipacao(festa.id);
    expect(interacao.pedidos()).toEqual([festa.id]);
    expect(avisos.lista().length).toBe(1);
    interacao.responderPedido(festa, true);
    expect(interacao.confirmadas()).toContain(festa.id);
    expect(interacao.pedidos()).not.toContain(festa.id);
    expect(avisos.lista()[0].texto).toContain('aprovado');
    expect(interacao.total(festa)).toBe(1);
    TestBed.resetTestingModule();
    expect(TestBed.inject(Interacao).confirmadas()).toContain(festa.id);
  });

  it('recusa sem confirmar e permite um novo pedido', () => {
    const interacao = TestBed.inject(Interacao);
    interacao.pedirParticipacao(festa.id);
    interacao.responderPedido(festa, false);
    expect(interacao.confirmadas()).not.toContain(festa.id);
    expect(interacao.respostaDaFesta(festa.id)).toBe('recusado');
    interacao.pedirParticipacao(festa.id);
    expect(interacao.respostaDaFesta(festa.id)).toBe('pendente');
  });

  it('impede aprovação quando não existem vagas', () => {
    const interacao = TestBed.inject(Interacao);
    interacao.pedirParticipacao(festa.id);
    interacao.responderPedido({ ...festa, pessoasConfirmadas: 1 }, true);
    expect(interacao.pedidos()).toContain(festa.id);
    expect(interacao.confirmadas()).not.toContain(festa.id);
  });

  it('entra e sai da espera e preserva a fila ao recarregar', () => {
    const interacao = TestBed.inject(Interacao);
    interacao.alternarEspera(festa);
    expect(interacao.espera()).toEqual([]);
    const lotada = { ...festa, pessoasConfirmadas: 1 };
    interacao.alternarEspera(lotada);
    TestBed.resetTestingModule();
    const recarregada = TestBed.inject(Interacao);
    expect(recarregada.espera()).toContain(festa.id);
    recarregada.alternarEspera(lotada);
    expect(recarregada.espera()).toEqual([]);
  });

  it('remove da espera após aprovação e persiste notificações lidas', () => {
    const interacao = TestBed.inject(Interacao);
    interacao.alternarEspera({ ...festa, pessoasConfirmadas: 1 });
    interacao.pedirParticipacao(festa.id);
    interacao.responderPedido(festa, true);
    expect(interacao.espera()).not.toContain(festa.id);
    TestBed.inject(Avisos).marcarLidos();
    TestBed.resetTestingModule();
    expect(TestBed.inject(Avisos).naoLidos()).toBe(0);
  });

  it('salva o perfil e restaura os dados', () => {
    const dados = { nome: 'Maria', foto: '', bio: 'Adoro música', estilos: 'Rock, Pagode' };
    new Usuario().salvar(dados);
    expect(new Usuario().perfil()).toEqual(dados);
  });

  it('edita sem duplicar festa nem perder imagem e participantes', () => {
    const servico = new FestaService();
    const criada = servico.criarFesta({ ...festa, imagem: 'assets/img1.jpg' });
    servico.atualizarFesta({ ...criada, nome: 'Nome atualizado' });
    const lista = new FestaService().festas();
    {
      expect(lista.filter((item) => item.id === criada.id).length).toBe(1);
      expect(lista.find((item) => item.id === criada.id)).toEqual({
        ...criada,
        nome: 'Nome atualizado',
      });
    }
  });
});
