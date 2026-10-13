import { Injectable, inject, signal } from '@angular/core';
import { Festa } from '../models/festa';
import { Interacao } from './interacao';
import { Avisos } from './avisos';

import { Avaliacao } from '../models/interacoes';
import {
  lerDados,
  salvarDados,
  lerAvaliacoes,
  salvarAvaliacoes,
} from '../integracoes/armazenamento';

@Injectable({ providedIn: 'root' })
export class Experiencias {
  private readonly avisos = inject(Avisos);
  checkins = signal<number[]>(lerDados('festou-checkins', []));
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
        `Ingresso emitido para ${festa.nome}.`,
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
    salvarDados('festou-checkins', this.checkins());
    this.avisos.adicionar(`Check-in confirmado em ${festa.nome}.`, festa.id);
    return 'Entrada confirmada.';
  }
  avaliacoes = signal<Avaliacao[]>(lerAvaliacoes());

  avaliacoesDaFesta(id: number): Avaliacao[] {
    const resultado: Avaliacao[] = [];
    for (const avaliacao of this.avaliacoes()) {
      if (avaliacao.festaId === id) {
        resultado.push(avaliacao);
      }
    }
    return resultado;
  }

  podeAvaliar(festa: Festa, pessoa: string): boolean {
    if (this.interacao.status(festa) !== 'encerrada') {
      return false;
    }
    if (pessoa === 'Você') {
      return this.interacao.confirmadas().includes(festa.id);
    }
    return this.interacao.amigosNaFesta(festa.id).includes(pessoa);
  }

  avaliar(festa: Festa, pessoa: string, nota: number, comentario: string): string {
    if (!this.podeAvaliar(festa, pessoa))
      return 'Somente participantes podem avaliar uma festa encerrada.';
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) return 'Escolha uma nota de 1 a 5.';
    const avaliacao: Avaliacao = {
      festaId: festa.id,
      pessoa,
      nota,
      comentario: comentario.trim().slice(0, 500),
    };
    const anteriores: Avaliacao[] = [];
    for (const item of this.avaliacoes()) {
      const mesmaFesta = item.festaId === festa.id;
      const mesmaPessoa = item.pessoa === pessoa;
      if (!mesmaFesta || !mesmaPessoa) {
        anteriores.push(item);
      }
    }
    this.avaliacoes.set([...anteriores, avaliacao]);
    salvarAvaliacoes(this.avaliacoes());
    return 'Avaliação salva! Uma nova avaliação substitui a anterior da mesma pessoa.';
  }

  media(id: number): string {
    const lista = this.avaliacoesDaFesta(id);
    if (lista.length === 0) {
      return '—';
    }
    let soma = 0;
    for (const avaliacao of lista) {
      soma += avaliacao.nota;
    }
    return (soma / lista.length).toFixed(1);
  }
}
