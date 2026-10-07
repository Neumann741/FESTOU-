import { Injectable, inject, signal } from '@angular/core';
import { Festa } from '../models/festa';
import { Interacao } from './interacao';
import { Avisos } from './avisos';

export interface Avaliacao {
  pessoa: string;
  nota: number;
  comentario: string;
}

@Injectable({ providedIn: 'root' })
export class Experiencias {
  private readonly avisos = inject(Avisos);
  checkins = signal<number[]>(JSON.parse(localStorage.getItem('festou-checkins') || '[]'));
  readonly interacao = inject(Interacao);

  codigo(festa: Festa): string {
    return `FESTOU-${festa.id}-LOCAL`;
  }

  emitir(festa: Festa): string {
    const confirmada = this.interacao.confirmadas().includes(festa.id);
    if (this.interacao.fechada(festa)) return 'Esta festa não está emitindo ingressos.';
    if (festa.tipo === 'privada' && !confirmada)
      return 'Peça aprovação antes de emitir o ingresso.';
    if (!confirmada && this.interacao.lotada(festa))
      return 'Festa esgotada. Entre na lista de espera.';
    if (!confirmada) this.interacao.confirmar(festa.id);
    if (!this.interacao.ingressos().includes(festa.id)) {
      this.interacao.comprarIngresso(festa.id);
      this.avisos.adicionar(
        `Ingresso fictício emitido para ${festa.nome}. Nenhuma cobrança realizada.`,
        festa.id,
      );
    }
    return 'Ingresso disponível abaixo. Sem valor comercial.';
  }

  checkin(festa: Festa): string {
    if (this.checkins().includes(festa.id)) return 'Este ingresso já foi utilizado.';
    if (
      this.interacao.fechada(festa) ||
      !this.interacao.confirmadas().includes(festa.id) ||
      !this.interacao.ingressos().includes(festa.id)
    )
      return 'É necessário ter ingresso e presença confirmada em uma festa ativa.';
    this.checkins.update((lista) => [...lista, festa.id]);
    localStorage.setItem('festou-checkins', JSON.stringify(this.checkins()));
    this.avisos.adicionar(`Check-in simulado em ${festa.nome}.`, festa.id);
    return 'Entrada confirmada na simulação!';
  }
  avaliacoes = signal<Record<number, Avaliacao[]>>(
    JSON.parse(localStorage.getItem('festou-avaliacoes') || '{}'),
  );

  podeAvaliar(festa: Festa, pessoa: string): boolean {
    return (
      this.interacao.status(festa) === 'encerrada' &&
      (pessoa === 'Você'
        ? this.interacao.confirmadas().includes(festa.id)
        : this.interacao.amigosNaFesta(festa.id).includes(pessoa))
    );
  }

  avaliar(festa: Festa, pessoa: string, nota: number, comentario: string): string {
    if (!this.podeAvaliar(festa, pessoa))
      return 'Somente participantes podem avaliar uma festa encerrada.';
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) return 'Escolha uma nota de 1 a 5.';
    const avaliacao = { pessoa, nota, comentario: comentario.trim().slice(0, 500) };
    this.avaliacoes.update((lista) => ({
      ...lista,
      [festa.id]: [...(lista[festa.id] || []).filter((item) => item.pessoa !== pessoa), avaliacao],
    }));
    localStorage.setItem('festou-avaliacoes', JSON.stringify(this.avaliacoes()));
    return 'Avaliação salva! Uma nova avaliação substitui a anterior da mesma pessoa.';
  }

  media(id: number): string {
    const lista = this.avaliacoes()[id] || [];
    return lista.length
      ? (lista.reduce((soma, item) => soma + item.nota, 0) / lista.length).toFixed(1)
      : '—';
  }
}
